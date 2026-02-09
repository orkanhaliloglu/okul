import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, MapPin, GraduationCap, Users, Trophy, BookOpen, Building2, Phone, Globe, Home, ChevronRight } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function UniversityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Fetch from Supabase
    const { data: uni } = await supabase
        .from('universities')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!uni) {
        notFound();
    }

    return (
        <div className="container py-8 max-w-5xl relative">
            <nav className="flex items-center text-sm text-muted-foreground mb-6">
                <Link href="/" className="hover:text-primary transition-colors flex items-center">
                    <Home className="h-4 w-4" />
                    <span className="sr-only">Ana Sayfa</span>
                </Link>
                <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/50" />
                <Link href="/yks-tercih-robotu" className="hover:text-primary transition-colors">
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/50" />
                <span className="font-medium text-foreground truncate max-w-[200px] sm:max-w-none">{uni.university_name}</span>
            </nav>

            <div className="grid gap-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{uni.university_name}</h1>
                        <p className="text-xl md:text-2xl text-muted-foreground mt-2">{uni.program_name}</p>
                        <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                            <MapPin className="h-5 w-5" />
                            <span className="text-lg">{uni.city}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="flex gap-2">
                            <Badge variant="secondary" className="text-lg px-4 py-1">{uni.score_type}</Badge>
                            <Badge className="text-lg px-4 py-1 bg-primary text-primary-foreground">{Number(uni.score).toFixed(2)} Puan</Badge>
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">Sıralama: {uni.ranking ? uni.ranking.toLocaleString() : '---'}</span>
                    </div>
                </div>

                {/* Main Content Tabs */}
                <Tabs defaultValue="overview" className="w-full mt-6">
                    <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
                        <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
                        <TabsTrigger value="nets">YKS Netleri</TabsTrigger>
                        <TabsTrigger value="contact">İletişim</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-6 space-y-6">
                        {/* Quick Stats Grid */}
                        <div className="grid md:grid-cols-3 gap-6">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Üniversite Türü</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2 text-xl font-bold">
                                        <Building2 className="h-5 w-5 text-primary" />
                                        {uni.type}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Fakülte</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2 text-base font-bold">
                                        <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
                                        <span className="line-clamp-2">{uni.faculty}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Kontenjan</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2 text-xl font-bold">
                                        <Users className="h-5 w-5 text-primary" />
                                        {uni.quota || '-'}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {uni.program_code && (
                            <div className="bg-muted/30 p-4 rounded-lg flex items-center justify-between border">
                                <span className="text-muted-foreground font-medium">YÖK Program Kodu (YOP)</span>
                                <span className="font-mono font-bold bg-muted px-2 py-1 rounded">{uni.program_code}</span>
                            </div>
                        )}

                        {uni.scholarship && (
                            <div className="bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg flex items-center">
                                <Trophy className="h-6 w-6 text-green-600 dark:text-green-400 mr-3" />
                                <div>
                                    <p className="font-semibold text-green-800 dark:text-green-300">Burs Durumu</p>
                                    <p className="text-green-700 dark:text-green-400">{uni.scholarship}</p>
                                </div>
                            </div>
                        )}

                        {/* Description & Details */}
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <Card className="h-full">
                                    <CardHeader>
                                        <CardTitle>Program Hakkında</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {uni.description || `${uni.university_name} bünyesindeki ${uni.program_name} bölümü, alanında yetkin akademik kadrosu ve sunduğu imkanlarla öğrencilerini geleceğe hazırlar.`}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="md:col-span-1 space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Puan Bilgileri</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center p-3 bg-muted/50 rounded-lg">
                                            <GraduationCap className="h-5 w-5 mr-3 text-primary" />
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Puan Türü</p>
                                                <p className="font-semibold">{uni.score_type}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center p-3 bg-muted/50 rounded-lg">
                                            <Trophy className="h-5 w-5 mr-3 text-primary" />
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Başarı Sıralaması</p>
                                                <p className="font-semibold">{uni.ranking ? uni.ranking.toLocaleString() : '---'}.</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="nets" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Yerleşenlerin Net Ortalamaları (2024)</CardTitle>
                                <p className="text-sm text-muted-foreground">Bu programa yerleşen son öğrencinin tahmini netleridir.</p>
                            </CardHeader>
                            <CardContent>
                                {(!uni.tyt_turkce_net && !uni.ayt_mat_net) ? (
                                    <div className="text-center py-12 bg-muted/20 rounded-lg border-2 border-dashed">
                                        <BookOpen className="h-10 w-10 mx-auto text-muted-foreground opacity-50 mb-3" />
                                        <p className="text-muted-foreground font-medium">Bu program için net verisi henüz eklenmemiş.</p>
                                        <p className="text-xs text-muted-foreground mt-1">YÖK Atlas verileri güncellendikçe eklenecektir.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        {/* TYT Section */}
                                        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border">
                                            <h3 className="font-bold text-lg mb-4 flex items-center text-slate-800 dark:text-slate-200">
                                                <Badge variant="outline" className="mr-3 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200">TYT</Badge>
                                                Temel Yeterlilik Testi
                                            </h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                                                    <div className="text-sm font-medium text-muted-foreground mb-1">Türkçe</div>
                                                    <div className="text-2xl font-bold text-primary">{uni.tyt_turkce_net || '-'}</div>
                                                    <div className="text-xs text-muted-foreground mt-1 bg-slate-100 dark:bg-slate-700/50 inline-block px-2 py-0.5 rounded-full">40 Soru</div>
                                                </div>
                                                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                                                    <div className="text-sm font-medium text-muted-foreground mb-1">Sosyal</div>
                                                    <div className="text-2xl font-bold text-primary">{uni.tyt_sosyal_net || '-'}</div>
                                                    <div className="text-xs text-muted-foreground mt-1 bg-slate-100 dark:bg-slate-700/50 inline-block px-2 py-0.5 rounded-full">20 Soru</div>
                                                </div>
                                                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                                                    <div className="text-sm font-medium text-muted-foreground mb-1">Matematik</div>
                                                    <div className="text-2xl font-bold text-primary">{uni.tyt_mat_net || '-'}</div>
                                                    <div className="text-xs text-muted-foreground mt-1 bg-slate-100 dark:bg-slate-700/50 inline-block px-2 py-0.5 rounded-full">40 Soru</div>
                                                </div>
                                                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                                                    <div className="text-sm font-medium text-muted-foreground mb-1">Fen</div>
                                                    <div className="text-2xl font-bold text-primary">{uni.tyt_fen_net || '-'}</div>
                                                    <div className="text-xs text-muted-foreground mt-1 bg-slate-100 dark:bg-slate-700/50 inline-block px-2 py-0.5 rounded-full">20 Soru</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* AYT Section */}
                                        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border">
                                            <h3 className="font-bold text-lg mb-4 flex items-center text-slate-800 dark:text-slate-200">
                                                <Badge variant="outline" className="mr-3 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200">AYT</Badge>
                                                Alan Yeterlilik Testi
                                            </h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                                                    <div className="text-sm font-medium text-muted-foreground mb-1">Matematik</div>
                                                    <div className="text-2xl font-bold text-primary">{uni.ayt_mat_net || '-'}</div>
                                                    <div className="text-xs text-muted-foreground mt-1 bg-slate-100 dark:bg-slate-700/50 inline-block px-2 py-0.5 rounded-full">40 Soru</div>
                                                </div>

                                                {uni.score_type === 'SAY' && (
                                                    <>
                                                        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                                                            <div className="text-sm font-medium text-muted-foreground mb-1">Fizik</div>
                                                            <div className="text-2xl font-bold text-primary">{uni.ayt_fizik_net || '-'}</div>
                                                            <div className="text-xs text-muted-foreground mt-1 bg-slate-100 dark:bg-slate-700/50 inline-block px-2 py-0.5 rounded-full">14 Soru</div>
                                                        </div>
                                                        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                                                            <div className="text-sm font-medium text-muted-foreground mb-1">Kimya</div>
                                                            <div className="text-2xl font-bold text-primary">{uni.ayt_kimya_net || '-'}</div>
                                                            <div className="text-xs text-muted-foreground mt-1 bg-slate-100 dark:bg-slate-700/50 inline-block px-2 py-0.5 rounded-full">13 Soru</div>
                                                        </div>
                                                        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                                                            <div className="text-sm font-medium text-muted-foreground mb-1">Biyoloji</div>
                                                            <div className="text-2xl font-bold text-primary">{uni.ayt_biyoloji_net || '-'}</div>
                                                            <div className="text-xs text-muted-foreground mt-1 bg-slate-100 dark:bg-slate-700/50 inline-block px-2 py-0.5 rounded-full">13 Soru</div>
                                                        </div>
                                                    </>
                                                )}

                                                {uni.score_type === 'EA' && (
                                                    <>
                                                        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                                                            <div className="text-sm font-medium text-muted-foreground mb-1">Edebiyat</div>
                                                            <div className="text-2xl font-bold text-primary">{uni.ayt_edebiyat_net || '-'}</div>
                                                            <div className="text-xs text-muted-foreground mt-1 bg-slate-100 dark:bg-slate-700/50 inline-block px-2 py-0.5 rounded-full">24 Soru</div>
                                                        </div>
                                                        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                                                            <div className="text-sm font-medium text-muted-foreground mb-1">Tarih-1</div>
                                                            <div className="text-2xl font-bold text-primary">{uni.ayt_tarih1_net || '-'}</div>
                                                            <div className="text-xs text-muted-foreground mt-1 bg-slate-100 dark:bg-slate-700/50 inline-block px-2 py-0.5 rounded-full">10 Soru</div>
                                                        </div>
                                                        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                                                            <div className="text-sm font-medium text-muted-foreground mb-1">Coğrafya-1</div>
                                                            <div className="text-2xl font-bold text-primary">{uni.ayt_cografya1_net || '-'}</div>
                                                            <div className="text-xs text-muted-foreground mt-1 bg-slate-100 dark:bg-slate-700/50 inline-block px-2 py-0.5 rounded-full">6 Soru</div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="contact" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>İletişim Bilgileri</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        {/* Placeholder for now as we don't have scraped contact info */}
                                        <div className="flex items-start">
                                            <MapPin className="h-5 w-5 mr-3 mt-1 text-primary" />
                                            <div>
                                                <p className="font-semibold">Adres</p>
                                                <p className="text-muted-foreground">{uni.university_name} Kampüsü, {uni.city}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <Globe className="h-5 w-5 mr-3 text-primary" />
                                            <div>
                                                <p className="font-semibold">Web Sitesi</p>
                                                <a href={`https://www.google.com/search?q=${encodeURIComponent(uni.university_name)}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                                    Web sitesini ara
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-64 bg-muted rounded-lg flex items-center justify-center text-muted-foreground border-2 border-dashed">
                                        Harita Yeri (Placeholder)
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
