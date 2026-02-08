import { notFound } from "next/navigation";
import Link from "next/link";
import { highSchools } from "@/data/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, MapPin, School, Users, GraduationCap, Languages, Clock, Phone, Globe, BookOpen, Home, ChevronRight } from "lucide-react";
import { ScoreWizard } from "@/components/score-wizard";

export function generateStaticParams() {
    return highSchools.map((school) => ({
        slug: school.slug,
    }));
}

export default async function HighSchoolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const school = highSchools.find((s) => s.slug === slug);

    if (!school) {
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
                <Link href="/lgs-tercih-robotu" className="hover:text-primary transition-colors">
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/50" />
                <span className="font-medium text-foreground truncate max-w-[200px] sm:max-w-none">{school.name}</span>
            </nav>

            <div className="grid gap-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{school.name}</h1>
                        <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                            <MapPin className="h-5 w-5" />
                            <span className="text-lg">{school.district}, {school.city}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <Badge className="text-lg px-4 py-1 bg-primary text-primary-foreground">{school.score} Puan</Badge>
                        <span className="text-sm font-medium text-muted-foreground">% {school.percentile} Dilim</span>
                    </div>
                </div>

                {/* Main Content Tabs */}
                <Tabs defaultValue="overview" className="w-full mt-6">
                    <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
                        <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
                        <TabsTrigger value="departments">Bölümler</TabsTrigger>
                        <TabsTrigger value="contact">İletişim</TabsTrigger>
                        <TabsTrigger value="calculator">Puan Hesapla</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-6 space-y-6">
                        {/* Quick Stats Grid */}
                        <div className="grid md:grid-cols-3 gap-6">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Okul Türü</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2 text-xl font-bold">
                                        <School className="h-5 w-5 text-primary" />
                                        {school.type}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Eğitim Süresi</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2 text-xl font-bold">
                                        <Clock className="h-5 w-5 text-primary" />
                                        {school.educationDuration} Yıl
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
                                        {school.quota}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Description & Details */}
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <Card className="h-full">
                                    <CardHeader>
                                        <CardTitle>Okul Hakkında</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {school.description || `${school.name}, öğrencilerine kaliteli eğitim sunmayı hedefleyen köklü bir kurumdur.`}
                                        </p>
                                        {school.images && school.images.length > 0 && (
                                            <div className="mt-6 grid grid-cols-2 gap-4">
                                                {school.images.map((img, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={img}
                                                        alt={`${school.name} ${idx + 1}`}
                                                        className="rounded-lg object-cover w-full h-48 bg-muted"
                                                        referrerPolicy="no-referrer"
                                                        loading="lazy"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="md:col-span-1 space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Diğer Bilgiler</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center p-3 bg-muted/50 rounded-lg">
                                            <Languages className="h-5 w-5 mr-3 text-primary" />
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Yabancı Dil</p>
                                                <p className="font-semibold">{school.language}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center p-3 bg-muted/50 rounded-lg">
                                            <GraduationCap className="h-5 w-5 mr-3 text-primary" />
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Öğretim Şekli</p>
                                                <p className="font-semibold">Normal Öğretim</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="departments" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Bölümler ve Alanlar</CardTitle>
                                <CardDescription>Bu okulda eğitim verilen alanlar.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {school.departments && school.departments.length > 0 ? (
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {school.departments.map((dept, idx) => (
                                            <li key={idx} className="flex items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                                <BookOpen className="h-5 w-5 mr-3 text-primary" />
                                                <span className="font-medium">{dept}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-muted-foreground">Bu okul için bölüm bilgisi girilmemiştir.</div>
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
                                        {school.address && (
                                            <div className="flex items-start">
                                                <MapPin className="h-5 w-5 mr-3 mt-1 text-primary" />
                                                <div>
                                                    <p className="font-semibold">Adres</p>
                                                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(school.address)}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                                        {school.address}
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                        {school.phone && (
                                            <div className="flex items-center">
                                                <Phone className="h-5 w-5 mr-3 text-primary" />
                                                <div>
                                                    <p className="font-semibold">Telefon</p>
                                                    <p className="text-muted-foreground">{school.phone}</p>
                                                </div>
                                            </div>
                                        )}
                                        {school.website && (
                                            <div className="flex items-center">
                                                <Globe className="h-5 w-5 mr-3 text-primary" />
                                                <div>
                                                    <p className="font-semibold">Web Sitesi</p>
                                                    <a href={school.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                                        {school.website}
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="h-64 bg-muted rounded-lg flex items-center justify-center text-muted-foreground border-2 border-dashed">
                                        Harita Yeri (Placeholder)
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="calculator" className="mt-6">
                        <ScoreWizard targetScore={school.score} schoolName={school.name} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
