"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useMemo, Suspense, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { HighSchool, UniversityProgram } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Building2,
    MapPin,
    GraduationCap,
    Search,
    Filter,
    ArrowRight,
    Star,
    BookOpen,
    School,
    Trophy,
    Users,
    Clock,
    Loader2
} from "lucide-react";

interface SearchViewProps {
    initialType?: 'lise' | 'universite';
}

export function SearchView({ initialType }: SearchViewProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Determine type from props or URL
    const typeParam = searchParams.get("type");
    const defaultType = initialType || (typeParam === "universite" ? "universite" : "lise");

    const [type, setType] = useState<'lise' | 'universite'>(defaultType);

    // High School Filters
    const [liseCity, setLiseCity] = useState(searchParams.get("city") || "");
    const [liseQuery, setLiseQuery] = useState(searchParams.get("q") || "");
    const [liseType, setLiseType] = useState(searchParams.get("schoolType") || ""); // 'Fen', 'Anadolu' etc.
    const [liseMinScore, setLiseMinScore] = useState(searchParams.get("minScore") || "");
    const [admissionType, setAdmissionType] = useState(searchParams.get("admission") || "LGS"); // LGS or OBP

    // University Filters
    const [uniQuery, setUniQuery] = useState(searchParams.get("q") || "");
    const [uniCity, setUniCity] = useState(searchParams.get("city") || "");
    const [uniMinScore, setUniMinScore] = useState(searchParams.get("minScore") || "");
    const [uniScoreType, setUniScoreType] = useState<string>(searchParams.get("scoreType") || "ALL");

    // Data State
    const [results, setResults] = useState<(HighSchool | UniversityProgram)[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialType) {
            setType(initialType);
        } else if (typeParam === 'universite' || typeParam === 'lise') {
            setType(typeParam);
        }
    }, [typeParam, initialType]);

    // Sync filters to URL
    useEffect(() => {
        const params = new URLSearchParams();

        if (type === 'lise') {
            if (liseCity) params.set('city', liseCity);
            if (liseQuery) params.set('q', liseQuery);
            if (liseType) params.set('schoolType', liseType);
            if (liseMinScore) params.set('minScore', liseMinScore);
            if (admissionType) params.set('admission', admissionType);
        } else {
            if (uniQuery) params.set('q', uniQuery);
            if (uniCity) params.set('city', uniCity);
            if (uniMinScore) params.set('minScore', uniMinScore);
            if (uniScoreType && uniScoreType !== 'ALL') params.set('scoreType', uniScoreType);
        }

        const currentString = searchParams.toString();
        const newString = params.toString();

        if (currentString !== newString) {
            router.replace(`${pathname}?${newString}`, { scroll: false });
        }
    }, [type, liseCity, liseQuery, liseType, liseMinScore, admissionType, uniQuery, uniCity, uniMinScore, uniScoreType, pathname, router, searchParams]);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let query;
                if (type === 'lise') {
                    query = supabase.from('high_schools').select('*');

                    if (liseCity) query = query.ilike('city', `%${liseCity}%`);
                    if (liseCity) query = query.ilike('city', `%${liseCity}%`);
                    if (liseQuery) query = query.ilike('name', `%${liseQuery}%`);
                    if (liseType) query = query.eq('type', liseType);
                    if (liseMinScore) {
                        // Show schools where admission score is <= user score (roughly)
                        // Or just show schools around that score. 
                        // Typically "Min Score" filter means "Show schools requiring at least X".
                        // But user prompt says "Puanın / Hedefin". 
                        // If user enters 450, they want schools <= 450 (which they can enter).
                        const score = parseFloat(liseMinScore);
                        if (!isNaN(score)) query = query.lte('score', score + 5);
                    }
                    if (admissionType) query = query.eq('admission_type', admissionType);

                    // Limit results
                    query = query.order('score', { ascending: false }).limit(2000);

                } else {
                    query = supabase.from('universities').select('*');

                    if (uniQuery) {
                        // Search in university_name or program_name
                        // Supabase 'or' query syntax: column.operator.value,column.operator.value
                        query = query.or(`university_name.ilike.%${uniQuery}%,program_name.ilike.%${uniQuery}%`);
                    }
                    if (uniCity) query = query.ilike('city', `%${uniCity}%`);
                    if (uniMinScore) {
                        const score = parseFloat(uniMinScore);
                        // Users want schools they can get into (<= their score)
                        if (!isNaN(score)) query = query.lte('score', score + 10);
                    }
                    if (uniScoreType && uniScoreType !== 'ALL') query = query.eq('score_type', uniScoreType);

                    // Limit results
                    query = query.order('score', { ascending: false }).limit(2000);
                }

                const { data, error } = await query;
                if (error) throw error;

                // Map DB keys (snake_case) to Type keys (camelCase)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const formattedData = (data || []).map((item: any) => {
                    if (type === 'lise') {
                        return {
                            ...item,
                            educationDuration: item.education_duration,
                            admissionType: item.admission_type,
                        } as HighSchool;
                    } else {
                        return {
                            ...item,
                            universityName: item.university_name,
                            programName: item.program_name,
                            scoreType: item.score_type,
                        } as UniversityProgram;
                    }
                });

                setResults(formattedData);
                console.log(`[DEBUG] Fetched ${formattedData.length} results. Type: ${type}`);
                console.log(`[DEBUG] Params: City=${liseCity || uniCity}, MinScore=${liseMinScore || uniMinScore}, Query=${uniQuery}`);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                console.error("Error fetching data:", err);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        // Debounce
        const timeout = setTimeout(fetchData, 300);
        return () => clearTimeout(timeout);
    }, [type, liseCity, liseQuery, liseType, liseMinScore, admissionType, uniQuery, uniCity, uniMinScore, uniScoreType]);


    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar */}
                <div className="w-full md:w-1/4 space-y-6">
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="h-5 w-5" /> Filtrele
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Type Switcher - Only show if not forced by route */}
                            {!initialType && (
                                <div className="flex w-full rounded-lg border p-1 bg-muted/50">
                                    <button
                                        className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${type === 'lise' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:bg-background/50'}`}
                                        onClick={() => setType('lise')}
                                    >
                                        Lise
                                    </button>
                                    <button
                                        className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${type === 'universite' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:bg-background/50'}`}
                                        onClick={() => setType('universite')}
                                    >
                                        Üniversite
                                    </button>
                                </div>
                            )}

                            {type === "lise" ? (
                                <>
                                    <div className="space-y-2">
                                        <Label>Yerleştirme Türü</Label>
                                        <Select value={admissionType} onValueChange={setAdmissionType}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="LGS">LGS Puanı ile</SelectItem>
                                                <SelectItem value="OBP">Diploma Notu (OBP) ile</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Şehir</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="İstanbul..."
                                                className="pl-9"
                                                value={liseCity}
                                                onChange={(e) => setLiseCity(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Okul Türü</Label>
                                        <Select value={liseType} onValueChange={setLiseType}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Tümü" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">Tümü</SelectItem>
                                                <SelectItem value="Fen">Fen Lisesi</SelectItem>
                                                <SelectItem value="Anadolu">Anadolu Lisesi</SelectItem>
                                                <SelectItem value="Anadolu İmam Hatip">Anadolu İmam Hatip</SelectItem>
                                                <SelectItem value="Sosyal Bilimler">Sosyal Bilimler</SelectItem>
                                                <SelectItem value="Mesleki ve Teknik">Meslek Lisesi</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Okul Adı</Label>
                                        <div className="relative">
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Örn: Fen Lisesi..."
                                                className="pl-9"
                                                value={liseQuery}
                                                onChange={(e) => setLiseQuery(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Puanın / Hedefin</Label>
                                        <div className="relative">
                                            <Trophy className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="number"
                                                placeholder="Örn: 450"
                                                className="pl-9"
                                                value={liseMinScore}
                                                onChange={(e) => setLiseMinScore(e.target.value)}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">Bu puana kadar olan okullar listelenir.</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <Label>Arama</Label>
                                        <div className="relative">
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Bölüm veya Üniversite..."
                                                className="pl-9"
                                                value={uniQuery}
                                                onChange={(e) => setUniQuery(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Puan Türü</Label>
                                        <Select value={uniScoreType} onValueChange={setUniScoreType}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ALL">Tümü</SelectItem>
                                                <SelectItem value="SAY">SAY (Sayısal)</SelectItem>
                                                <SelectItem value="EA">EA (Eşit Ağırlık)</SelectItem>
                                                <SelectItem value="SOZ">SÖZ (Sözel)</SelectItem>
                                                <SelectItem value="DIL">DİL (Yabancı Dil)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Şehir</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Ankara..."
                                                className="pl-9"
                                                value={uniCity}
                                                onChange={(e) => setUniCity(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>YKS Puanın</Label>
                                        <div className="relative">
                                            <Trophy className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="number"
                                                placeholder="Örn: 480"
                                                className="pl-9"
                                                value={uniMinScore}
                                                onChange={(e) => setUniMinScore(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Results Area */}
                <div className="flex-1 space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-indigo-950 dark:text-indigo-100">
                            {type === 'lise' ? 'Lise Tercih Robotu' : 'Üniversite Tercih Robotu'}
                        </h1>
                        <Badge variant="outline" className="text-lg px-4 py-1">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : `${results.length} Sonuç`}
                        </Badge>
                    </div>

                    <div className="grid gap-4">
                        {loading ? (
                            <div className="py-20 flex justify-center">
                                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                            </div>
                        ) : results.length === 0 ? (
                            <Card className="bg-muted/50 border-dashed">
                                <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                                    <Search className="h-12 w-12 mb-4 opacity-50" />
                                    <h3 className="text-lg font-medium">Sonuç Bulunamadı</h3>
                                    <p>Arama kriterlerini değiştirerek tekrar deneyebilirsin.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            results.map((item: HighSchool | UniversityProgram) => (
                                <Card key={item.id} className="group overflow-hidden hover:shadow-md transition-all border-l-4 border-l-transparent hover:border-l-indigo-500">
                                    <CardContent className="p-0">
                                        <div className="flex flex-col md:flex-row">
                                            {/* Image Placeholder or Real Image */}
                                            <div className="hidden md:block w-48 bg-muted relative">
                                                {item.images && item.images[0] ? (
                                                    <img src={item.images[0]} alt={type === 'lise' ? (item as HighSchool).name : (item as UniversityProgram).universityName} className="object-cover w-full h-full" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-muted-foreground/30">
                                                        {type === 'lise' ? <School className="h-12 w-12" /> : <Building2 className="h-12 w-12" />}
                                                    </div>
                                                )}
                                                {/* Score Badge Overlay */}
                                                <div className="absolute top-2 left-2">
                                                    <Badge className={`${type === 'lise' ? 'bg-indigo-600' : 'bg-violet-600'}`}>
                                                        {item.score?.toFixed(2) || 'N/A'} Puan
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="flex-1 p-6 space-y-3">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        {type === 'lise' ? (
                                                            <Badge variant="secondary" className="mb-2">{item.type}</Badge>
                                                        ) : (
                                                            <div className="flex gap-2 mb-2">
                                                                <Badge variant="secondary">{item.type}</Badge>
                                                                <Badge variant="outline">{(item as UniversityProgram).scoreType}</Badge>
                                                            </div>
                                                        )}
                                                        <h3 className="text-xl font-bold group-hover:text-indigo-600 transition-colors">
                                                            <Link href={type === 'lise' ? `/lise/${item.slug}` : `/universite/${item.slug}`}>
                                                                {type === 'lise' ? (item as HighSchool).name : (item as UniversityProgram).programName}
                                                            </Link>
                                                        </h3>
                                                        <p className="text-muted-foreground flex items-center gap-1 mt-1">
                                                            <MapPin className="h-4 w-4" />
                                                            {item.city} {type === 'lise' ? (item as HighSchool).district && `/ ${(item as HighSchool).district}` : ''}
                                                            {type === 'universite' && ` • ${(item as UniversityProgram).universityName}`}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-2">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Trophy className="h-4 w-4 text-orange-500" />
                                                        <span className="font-medium text-foreground">
                                                            {type === 'lise' ? `%${(item as HighSchool).percentile}` : `#${(item as UniversityProgram).ranking || '---'}`}
                                                        </span>
                                                        <span className="text-muted-foreground text-xs">
                                                            {type === 'lise' ? 'Dilim' : 'Sıralama'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Users className="h-4 w-4 text-blue-500" />
                                                        <span className="font-medium text-foreground">{item.quota}</span>
                                                        <span className="text-muted-foreground text-xs">Kont.</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-2 border-t mt-2">
                                                    <p className="text-xs text-muted-foreground">
                                                        2024 Verileri
                                                    </p>
                                                    <Link href={type === 'lise' ? `/lise/${item.slug}` : `/universite/${item.slug}`}>
                                                        <Button variant="default" size="sm" className="gap-2 bg-white/90 hover:bg-white text-zinc-950 font-medium shadow-sm transition-colors">
                                                            İncele <ArrowRight className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function SearchPageMain() {
    return (
        <Suspense fallback={<div className="container py-8 text-center">Yükleniyor...</div>}>
            <SearchView />
        </Suspense>
    )
}
