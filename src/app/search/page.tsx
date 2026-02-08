"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useMemo, Suspense, useEffect } from "react";
import Link from "next/link";
import { highSchools, universities } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, School, GraduationCap, Filter, Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce"; // We might need to create this or just use timeout

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Initial state from URL
    const type = searchParams.get("type") || "lise";

    // State for filters
    const [filters, setFilters] = useState({
        city: searchParams.get("city") || "",
        minScore: searchParams.get("minScore") || "",
        maxScore: searchParams.get("maxScore") || "",
        text: searchParams.get("q") || "",
        admission: searchParams.get("admission") || "LGS"
    });

    // Update URL when filters change (Debounced to avoid too many pushes for text inputs)
    useEffect(() => {
        const handler = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());

            if (filters.city) params.set("city", filters.city); else params.delete("city");
            if (filters.minScore) params.set("minScore", filters.minScore); else params.delete("minScore");
            if (filters.maxScore) params.set("maxScore", filters.maxScore); else params.delete("maxScore");
            if (filters.text) params.set("q", filters.text); else params.delete("q");
            if (filters.admission) params.set("admission", filters.admission); else params.delete("admission");

            // Should always preserve type if possible, or it relies on default
            if (type) params.set("type", type);

            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }, 500);

        return () => clearTimeout(handler);
    }, [filters, router, pathname, searchParams, type]);

    const filteredData = useMemo(() => {
        const searchText = filters.text.toLowerCase("tr");
        const searchCity = filters.city.toLowerCase("tr");

        if (type === "lise") {
            return highSchools.filter(school => {
                const matchAdmission = school.admissionType === filters.admission;
                const matchCity = !filters.city || school.city.toLowerCase("tr").includes(searchCity);

                // Deep search for text
                const matchText = !filters.text ||
                    school.name.toLowerCase("tr").includes(searchText) ||
                    school.description?.toLowerCase("tr").includes(searchText) ||
                    school.departments?.some(d => d.toLowerCase("tr").includes(searchText));

                const matchMinScore = !filters.minScore || school.score >= Number(filters.minScore);
                const matchMaxScore = !filters.maxScore || school.score <= Number(filters.maxScore);

                return matchAdmission && matchCity && matchText && matchMinScore && matchMaxScore;
            });
        } else {
            return universities.filter(uni => {
                const matchCity = !filters.city || uni.city.toLowerCase("tr").includes(searchCity);

                // Deep search for universities too
                const matchText = !filters.text ||
                    uni.universityName.toLowerCase("tr").includes(searchText) ||
                    uni.programName.toLowerCase("tr").includes(searchText) ||
                    uni.faculty.toLowerCase("tr").includes(searchText) ||
                    uni.description?.toLowerCase("tr").includes(searchText);

                const matchMinScore = !filters.minScore || uni.score >= Number(filters.minScore);
                const matchMaxScore = !filters.maxScore || uni.score <= Number(filters.maxScore);

                return matchCity && matchText && matchMinScore && matchMaxScore;
            });
        }
    }, [type, filters]);

    // SEO Title Update (Client Side)
    useEffect(() => {
        document.title = `${type === 'lise' ? 'Lise' : 'Üniversite'} Arama Sonuçları - Okul Bul`;
    }, [type]);

    return (
        <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="w-full md:w-64 space-y-6">
                <div className="flex items-center gap-2 font-bold text-lg">
                    <Filter className="h-5 w-5" /> Filtreler
                </div>

                <div className="space-y-4">
                    {/* Toggle Type */}
                    <div className="flex p-1 bg-muted rounded-lg w-full">
                        <Link href="/search?type=lise" className={`flex-1 py-1 text-center text-sm font-medium rounded-md transition-all ${type === 'lise' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}>
                            Lise
                        </Link>
                        <Link href="/search?type=universite" className={`flex-1 py-1 text-center text-sm font-medium rounded-md transition-all ${type === 'universite' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}>
                            Üniversite
                        </Link>
                    </div>

                    {type === "lise" && (
                        <div>
                            <label className="text-sm font-medium mb-2 block">Giriş Türü</label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant={filters.admission === "LGS" ? "default" : "outline"}
                                    onClick={() => setFilters({ ...filters, admission: "LGS" })}
                                    size="sm"
                                >
                                    LGS
                                </Button>
                                <Button
                                    variant={filters.admission === "OBP" ? "default" : "outline"}
                                    onClick={() => setFilters({ ...filters, admission: "OBP" })}
                                    size="sm"
                                >
                                    OBP
                                </Button>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="text-sm font-medium mb-1 block">Arama</label>
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={type === 'lise' ? "Okul adı, ilçe..." : "Bölüm, fakülte, meslek..."}
                                className="pl-8"
                                value={filters.text}
                                onChange={(e) => setFilters({ ...filters, text: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-1 block">Şehir</label>
                        <Input
                            placeholder="Şehir Giriniz"
                            value={filters.city}
                            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-1 block">Puan Aralığı</label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Min"
                                type="number"
                                value={filters.minScore}
                                onChange={(e) => setFilters({ ...filters, minScore: e.target.value })}
                            />
                            <Input
                                placeholder="Max"
                                type="number"
                                value={filters.maxScore}
                                onChange={(e) => setFilters({ ...filters, maxScore: e.target.value })}
                            />
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                            setFilters({ city: "", minScore: "", maxScore: "", text: "", admission: "LGS" });
                            router.replace(`/search?type=${type}`);
                        }}
                    >
                        Filtreleri Temizle
                    </Button>
                </div>
            </div>

            {/* Results */}
            <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">
                        {type === 'lise' ? 'Liseler' : 'Üniversiteler'}
                    </h1>
                    <Badge variant="secondary" className="text-base px-3 py-1">{filteredData.length} Sonuç Bulundu</Badge>
                </div>

                <div className="grid gap-4">
                    {filteredData.length === 0 ? (
                        <Card className="border-dashed bg-muted/30">
                            <CardContent className="text-center py-12">
                                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                                <h3 className="text-lg font-medium text-foreground">Sonuç Bulunamadı</h3>
                                <p className="text-muted-foreground mt-1">Yaptığınız aramaya uygun bir okul veya bölüm bulunamadı. Filtreleri genişletmeyi deneyin.</p>
                                <Button
                                    variant="link"
                                    onClick={() => setFilters({ city: "", minScore: "", maxScore: "", text: "", admission: "LGS" })}
                                    className="mt-4"
                                >
                                    Filtreleri Sıfırla
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredData.map((item) => (
                            <Card key={item.id} className="transition-all hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 group">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <CardTitle className="text-xl group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                {'name' in item ? item.name : item.universityName}
                                            </CardTitle>
                                            {'programName' in item ? (
                                                <CardDescription className="text-base font-medium text-foreground mt-1 flex items-center gap-2">
                                                    <span className="text-indigo-600 dark:text-indigo-400">{item.programName}</span>
                                                    <span className="text-muted-foreground">•</span>
                                                    <span>{item.faculty}</span>
                                                </CardDescription>
                                            ) : (
                                                <CardDescription className="text-base font-medium mt-1">
                                                    {item.type} Lisesi
                                                </CardDescription>
                                            )}
                                        </div>
                                        <Badge variant={type === 'lise' && filters.admission === 'OBP' ? "secondary" : "default"} className="text-base px-3 py-1 shrink-0">
                                            {item.score} {type === 'lise' ? (filters.admission === 'OBP' ? 'Ort.' : 'Puan') : 'Puan'}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="h-4 w-4 text-indigo-500" />
                                            <span className="text-foreground">{item.city}</span>
                                            {'district' in item && <span className="opacity-75">/ {item.district}</span>}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            {'name' in item ? <School className="h-4 w-4 text-indigo-500" /> : <GraduationCap className="h-4 w-4 text-indigo-500" />}
                                            <span>{item.type}</span>
                                        </div>
                                        {'language' in item && (
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-medium text-foreground">Dil:</span> {item.language}
                                            </div>
                                        )}
                                        {'ranking' in item && (
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-medium text-foreground">Sıralama:</span> #{item.ranking.toLocaleString()}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-medium text-foreground">Kontenjan:</span> {item.quota}
                                        </div>
                                    </div>
                                    {(('description' in item && item.description) || ('departments' in item && item.departments)) && (
                                        <div className="mt-4 pt-4 border-t text-sm text-muted-foreground line-clamp-2">
                                            {item.description || (item as any).departments?.join(", ")}
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="pt-2">
                                    <Link href={`/${type === 'lise' ? 'lise' : 'universite'}/${item.slug}`} className="w-full">
                                        <Button variant="secondary" className="w-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 group-hover:text-indigo-600 dark:group-hover:text-indigo-300">
                                            Detayları Gör <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

// Helper icons
import { ArrowRight } from "lucide-react";

export default function SearchPage() {
    return (
        <div className="container py-8 animated-in fade-in duration-500">
            <Suspense fallback={<div className="text-center py-20 text-muted-foreground">Yükleniyor...</div>}>
                <SearchContent />
            </Suspense>
        </div>
    );
}
