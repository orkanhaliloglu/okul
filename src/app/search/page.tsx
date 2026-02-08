"use client";

import { useSearchParams } from "next/navigation";
import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { highSchools, universities } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, School, GraduationCap, Filter, Search } from "lucide-react";

function SearchContent() {
    const searchParams = useSearchParams();
    const type = searchParams.get("type") || "lise"; // 'lise' or 'universite'

    const [filters, setFilters] = useState({
        city: "",
        minScore: "",
        maxScore: "",
        text: "",
        admission: searchParams.get("admission") || "LGS"
    });

    const filteredData = useMemo(() => {
        if (type === "lise") {
            return highSchools.filter(school => {
                const matchAdmission = school.admissionType === filters.admission;
                const matchCity = !filters.city || school.city.toLowerCase().includes(filters.city.toLowerCase());
                const matchText = !filters.text || school.name.toLowerCase().includes(filters.text.toLowerCase());
                const matchMinScore = !filters.minScore || school.score >= Number(filters.minScore);
                const matchMaxScore = !filters.maxScore || school.score <= Number(filters.maxScore);
                return matchAdmission && matchCity && matchText && matchMinScore && matchMaxScore;
            });
        } else {
            return universities.filter(uni => {
                const matchCity = !filters.city || uni.city.toLowerCase().includes(filters.city.toLowerCase());
                const matchText = !filters.text ||
                    uni.universityName.toLowerCase().includes(filters.text.toLowerCase()) ||
                    uni.programName.toLowerCase().includes(filters.text.toLowerCase());
                const matchMinScore = !filters.minScore || uni.score >= Number(filters.minScore);
                const matchMaxScore = !filters.maxScore || uni.score <= Number(filters.maxScore);
                return matchCity && matchText && matchMinScore && matchMaxScore;
            });
        }
    }, [type, filters]);

    return (
        <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="w-full md:w-64 space-y-6">
                <div className="flex items-center gap-2 font-bold text-lg">
                    <Filter className="h-5 w-5" /> Filtreler
                </div>

                <div className="space-y-4">
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
                        <Input
                            placeholder="Okul veya Bölüm Adı"
                            value={filters.text}
                            onChange={(e) => setFilters({ ...filters, text: e.target.value })}
                        />
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
                        onClick={() => setFilters({ city: "", minScore: "", maxScore: "", text: "", admission: "LGS" })}
                    >
                        Filtreleri Temizle
                    </Button>
                </div>
            </div>

            {/* Results */}
            <div className="flex-1">
                <h1 className="text-3xl font-bold mb-6">
                    {type === 'lise' ? 'Liseler' : 'Üniversiteler'}
                    <Badge variant="secondary" className="ml-3 text-lg">{filteredData.length} Sonuç</Badge>
                </h1>

                <div className="grid gap-4">
                    {filteredData.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            Sonuç bulunamadı. Filtreleri değiştirmeyi deneyin.
                        </div>
                    ) : (
                        filteredData.map((item) => (
                            <Card key={item.id} className="transition-all hover:shadow-md">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-xl">
                                                {'name' in item ? item.name : item.universityName}
                                            </CardTitle>
                                            {'programName' in item && (
                                                <CardDescription className="text-base font-medium text-foreground mt-1">
                                                    {item.programName} - {item.faculty}
                                                </CardDescription>
                                            )}
                                        </div>
                                        <Badge variant={type === 'lise' && filters.admission === 'OBP' ? "secondary" : "default"}>
                                            {item.score} {type === 'lise' ? (filters.admission === 'OBP' ? 'Ort.' : 'Puan') : 'Puan'}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" /> {item.city} {'district' in item ? `/ ${item.district}` : ''}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {'name' in item ? <School className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
                                            {item.type}
                                        </div>
                                        {'language' in item ? (
                                            <div className="flex items-center gap-1">
                                                <span>Dil: {item.language}</span>
                                            </div>
                                        ) : 'ranking' in item ? (
                                            <div className="flex items-center gap-1">
                                                <span>Sıralama: {item.ranking.toLocaleString()}</span>
                                            </div>
                                        ) : null}
                                        <div className="flex items-center gap-1">
                                            <span>Kontenjan: {item.quota}</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-2">
                                    <Link href={`/${type === 'lise' ? 'lise' : 'universite'}/${item.slug}`} className="w-full">
                                        <Button variant="secondary" className="w-full">Detayları Gör</Button>
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

export default function SearchPage() {
    return (
        <div className="container py-8">
            <Suspense fallback={<div className="text-center py-12">Yükleniyor...</div>}>
                <SearchContent />
            </Suspense>
        </div>
    );
}
