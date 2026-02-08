"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, School, Search, MapPin, ChevronRight, BookOpen, Calculator, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreWizard } from "@/components/score-wizard";

export default function Home() {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [admissionType, setAdmissionType] = useState<'LGS' | 'OBP'>('LGS');

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header removed - now in RootLayout */}

      <main className="flex-1">
        <section className="relative space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src="/images/hero-bg.png"
              alt="Okul Kampüsü"
              className="h-full w-full object-cover"
            />
            {/* Student Image Overlay */}
            <div className="absolute right-[-10%] bottom-0 h-[80%] w-auto opacity-30 invert-0 dark:invert-0 pointer-events-none select-none md:right-[5%] z-0">
              <img
                src="/images/lise-bg.png"
                alt="Öğrenci"
                className="h-full w-auto object-contain blur-[2px]"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white dark:from-black/90 dark:via-black/80 dark:to-background"></div>
          </div>

          <div className="container relative z-10 flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-sm font-medium">
              2024-2025 Güncel Veriler
            </Badge>
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
              Geleceğini Şansa Bırakma, <br className="hidden md:block" />
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                En Doğru Okulu Bul!
              </span>
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              LGS, OBP veya YKS puanına göre sana en uygun liseyi veya üniversiteyi saniyeler içinde keşfet. Detaylı filtreleme ile hayalindeki okula bir adım daha yaklaş.
            </p>

            <div className="w-full max-w-4xl mt-12">
              {!activeTab ? (
                <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <Card
                    className="group cursor-pointer border-2 hover:border-indigo-500 transition-all hover:scale-105 hover:shadow-xl bg-white/80 dark:bg-black/50 backdrop-blur-sm"
                    onClick={() => setActiveTab("lise")}
                  >
                    <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                      <div className="p-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <School className="h-10 w-10 text-indigo-600 dark:text-indigo-400 group-hover:text-white" />
                      </div>
                      <h3 className="text-2xl font-bold">Lise Arıyorum</h3>
                      <p className="text-muted-foreground">
                        LGS puanınla veya okul ortalamanla (OBP) gidebileceğin en iyi liseleri keşfet.
                      </p>
                      <Button variant="outline" className="mt-4 group-hover:bg-indigo-600 group-hover:text-white">
                        Liseleri İncele <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>

                  <Card
                    className="group cursor-pointer border-2 hover:border-violet-500 transition-all hover:scale-105 hover:shadow-xl bg-white/80 dark:bg-black/50 backdrop-blur-sm"
                    onClick={() => setActiveTab("universite")}
                  >
                    <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                      <div className="p-4 rounded-full bg-violet-100 dark:bg-violet-900/30 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                        <GraduationCap className="h-10 w-10 text-violet-600 dark:text-violet-400 group-hover:text-white" />
                      </div>
                      <h3 className="text-2xl font-bold">Üniversite Arıyorum</h3>
                      <p className="text-muted-foreground">
                        YKS (TYT-AYT) puanına veya başarı sıralamana göre hayalindeki üniversiteyi bul.
                      </p>
                      <Button variant="outline" className="mt-4 group-hover:bg-violet-600 group-hover:text-white">
                        Üniversiteleri İncele <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>

                  <Card
                    className="md:col-span-2 group cursor-pointer border-2 hover:border-emerald-500 transition-all hover:shadow-xl bg-white/80 dark:bg-black/50 backdrop-blur-sm mt-4"
                    onClick={() => setActiveTab("calculator")}
                  >
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <Calculator className="h-6 w-6 text-emerald-600 dark:text-emerald-400 group-hover:text-white" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-bold">LGS Puan Hesaplama</h3>
                          <p className="text-sm text-muted-foreground">Netlerini gir, tahmini puanını anında öğren.</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="mb-6 flex justify-start">
                    <Button
                      variant="ghost"
                      onClick={() => setActiveTab(null)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Geri Dön
                    </Button>
                  </div>

                  <Card className="border-0 shadow-2xl ring-1 ring-gray-900/5 backdrop-blur-sm bg-white/80 dark:bg-black/50 overflow-hidden">
                    <CardContent className="p-0">
                      <Tabs value={activeTab as string} onValueChange={(val) => setActiveTab(val)} className="w-full">
                        <div className="bg-muted/30 border-b p-4">
                          <h2 className="text-2xl font-bold flex items-center gap-3">
                            {activeTab === "lise" && <><School className="h-6 w-6 text-indigo-600" /> Lise Arama Filtreleri</>}
                            {activeTab === "universite" && <><GraduationCap className="h-6 w-6 text-violet-600" /> Üniversite Arama Filtreleri</>}
                            {activeTab === "calculator" && <><Calculator className="h-6 w-6 text-emerald-600" /> Puan Hesaplama</>}
                          </h2>
                        </div>

                        <div className="p-6">
                          <TabsContent value="lise" className="mt-0 space-y-6">
                            <p className="text-muted-foreground text-left mb-4">
                              Aradığın lisenin özelliklerini aşağıdan seçerek filtreleyebilirsin.
                            </p>
                            <div className="space-y-3 text-left">
                              <label className="text-sm font-medium">Giriş Türü</label>
                              <div className="grid grid-cols-2 gap-4">
                                <button
                                  onClick={() => setAdmissionType('LGS')}
                                  className={`relative flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${admissionType === 'LGS' ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" : "border-muted bg-transparent hover:bg-accent hover:text-accent-foreground"}`}
                                >
                                  <span className="text-lg font-bold">LGS Puanı</span>
                                  <span className="text-xs text-muted-foreground text-center">Merkezi Sınav ile</span>
                                  {admissionType === 'LGS' && <Check className="absolute top-2 right-2 h-4 w-4 text-indigo-600" />}
                                </button>
                                <button
                                  onClick={() => setAdmissionType('OBP')}
                                  className={`relative flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${admissionType === 'OBP' ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" : "border-muted bg-transparent hover:bg-accent hover:text-accent-foreground"}`}
                                >
                                  <span className="text-lg font-bold">Diploma Notu</span>
                                  <span className="text-xs text-muted-foreground text-center">Okul Başarısı ile</span>
                                  {admissionType === 'OBP' && <Check className="absolute top-2 right-2 h-4 w-4 text-indigo-600" />}
                                </button>
                              </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                              <div className="space-y-2 text-left">
                                <label className="text-sm font-medium">Şehir</label>
                                <div className="relative">
                                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                  <Input placeholder="İl Seçiniz (Örn: İstanbul)" className="pl-9" />
                                </div>
                              </div>
                              <div className="space-y-2 text-left">
                                <label className="text-sm font-medium">Puan Aralığı</label>
                                <div className="relative">
                                  <School className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                  <Input placeholder="Örn: 400-450" className="pl-9" type="number" />
                                </div>
                              </div>
                            </div>
                            <Link href={`/search?type=lise&admission=${admissionType}`} className="block w-full">
                              <Button size="lg" className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25 mt-4">
                                <Search className="mr-2 h-5 w-5" />
                                Liseleri Listele
                              </Button>
                            </Link>
                          </TabsContent>

                          <TabsContent value="universite" className="mt-0 space-y-6">
                            <p className="text-muted-foreground text-left mb-4">
                              Üniversite ve bölüm tercihlerine göre arama yap.
                            </p>
                            <div className="grid gap-6 md:grid-cols-3">
                              <div className="space-y-2 text-left">
                                <label className="text-sm font-medium">Bölüm Adı</label>
                                <div className="relative">
                                  <BookOpen className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                  <Input placeholder="Örn: Bilgisayar Müh." className="pl-9" />
                                </div>
                              </div>
                              <div className="space-y-2 text-left">
                                <label className="text-sm font-medium">Şehir</label>
                                <div className="relative">
                                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                  <Input placeholder="İl Seçiniz" className="pl-9" />
                                </div>
                              </div>
                              <div className="space-y-2 text-left">
                                <label className="text-sm font-medium">Puan Türü</label>
                                <div className="relative">
                                  <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                  <Input placeholder="SAY, EA, SÖZ..." className="pl-9" />
                                </div>
                              </div>
                            </div>
                            <Link href="/search?type=universite" className="block w-full">
                              <Button size="lg" className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25 mt-4">
                                <Search className="mr-2 h-5 w-5" />
                                Üniversite Ara
                              </Button>
                            </Link>
                          </TabsContent>

                          <TabsContent value="calculator" className="mt-0">
                            <ScoreWizard />
                          </TabsContent>
                        </div>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl font-bold">Öne Çıkan Özellikler</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Okul arama sürecinizi kolaylaştıran araçlarımızı keşfedin.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            {[
              {
                title: "Akıllı Filtreleme",
                description: "Puan, yüzdelik dilim, şehir ve okul türüne göre detaylı filtreleme yapın.",
                icon: Search
              },
              {
                title: "Karşılaştırma",
                description: "Beğendiğiniz okulları yan yana karşılaştırın, en doğru kararı verin.",
                icon: BookOpen
              },
              {
                title: "Detaylı Bilgi",
                description: "Kontenjan, eğitim süresi, yabancı dil gibi kritik bilgilere hızlıca ulaşın.",
                icon: School
              },
            ].map((feature, i) => (
              <Card key={i} className="flex flex-col items-center p-6 text-center transition-all hover:scale-105 hover:shadow-lg">
                <div className="mb-4 rounded-full bg-indigo-100 p-3 dark:bg-indigo-900/20">
                  <feature.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by <span className="font-medium underline underline-offset-4">Antigravity</span>. The source code is available on <span className="font-medium underline underline-offset-4">GitHub</span>.
          </p>
        </div>
      </footer>
    </div>
  );
}
