"use client";

import Link from "next/link";
import { GraduationCap, School, Search, ChevronRight, BookOpen, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="relative space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 min-h-[95vh] flex flex-col justify-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src="/images/hero-bg.png"
              alt="Okul Kampüsü"
              className="h-full w-full object-cover opacity-30 dark:opacity-20"
            />
            {/* Main Gradient Wash for Text Readability - Left oriented */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent lg:w-[80%]"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>

            {/* Student Image - Realistic & Charming */}
            <div className="absolute right-0 md:right-0 lg:right-10 bottom-0 h-[50vh] md:h-[65vh] lg:h-[75vh] w-auto z-0 pointer-events-none select-none flex items-end justify-end">
              {/* Back Glow for Dark Mode */}
              <div className="absolute bottom-1/4 right-1/4 w-[80%] h-[60%] bg-indigo-500/30 blur-[120px] rounded-full dark:bg-indigo-600/20 mix-blend-screen"></div>

              <img
                src="/images/hero-student.png"
                alt="Lise ve Üniversite Tercih Robotu Kullanan Mutlu Öğrenci"
                className="h-full w-auto object-contain object-bottom drop-shadow-2xl dark:drop-shadow-[0_0_30px_rgba(79,70,229,0.3)] animate-in fade-in slide-in-from-bottom-10 duration-1000"
              />

              {/* Blending Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent h-[20%] bottom-0"></div>
            </div>
          </div>

          <div className="container relative z-10 flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-sm font-medium">
              2024-2025 Güncel Veriler
            </Badge>
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
              Geleceğini Şansa Bırakma, <br className="hidden md:block" />
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                LGS & YKS Tercih Robotu
              </span>
              <br />
              ile En Doğru Okulu Bul!
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              LGS, OBP veya YKS puanına göre sana en uygun liseyi veya üniversiteyi saniyeler içinde keşfet. Detaylı filtreleme ile hayalindeki okula bir adım daha yaklaş.
            </p>

            <div className="w-full max-w-4xl mt-12">
              <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Link href="/lgs-tercih-robotu" className="block h-full">
                  <Card className="group cursor-pointer border-2 hover:border-indigo-500 transition-all hover:scale-105 hover:shadow-xl bg-white/80 dark:bg-black/50 backdrop-blur-sm h-full">
                    <CardContent className="p-8 flex flex-col items-center text-center space-y-4 h-full">
                      <div className="p-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <School className="h-10 w-10 text-indigo-600 dark:text-indigo-400 group-hover:text-white" />
                      </div>
                      <h3 className="text-2xl font-bold">Lise Arıyorum</h3>
                      <p className="text-muted-foreground flex-1">
                        LGS puanınla veya okul ortalamanla (OBP) gidebileceğin en iyi liseleri keşfet.
                      </p>
                      <Button variant="outline" className="mt-4 group-hover:bg-indigo-600 group-hover:text-white w-full">
                        Liseleri İncele <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/yks-tercih-robotu" className="block h-full">
                  <Card className="group cursor-pointer border-2 hover:border-violet-500 transition-all hover:scale-105 hover:shadow-xl bg-white/80 dark:bg-black/50 backdrop-blur-sm h-full">
                    <CardContent className="p-8 flex flex-col items-center text-center space-y-4 h-full">
                      <div className="p-4 rounded-full bg-violet-100 dark:bg-violet-900/30 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                        <GraduationCap className="h-10 w-10 text-violet-600 dark:text-violet-400 group-hover:text-white" />
                      </div>
                      <h3 className="text-2xl font-bold">Üniversite Arıyorum</h3>
                      <p className="text-muted-foreground flex-1">
                        YKS (TYT-AYT) puanına veya başarı sıralamana göre hayalindeki üniversiteyi bul.
                      </p>
                      <Button variant="outline" className="mt-4 group-hover:bg-violet-600 group-hover:text-white w-full">
                        Üniversiteleri İncele <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/puan-hesaplama" className="block h-full md:col-span-2">
                  <Card className="group cursor-pointer border-2 hover:border-emerald-500 transition-all hover:shadow-xl bg-white/80 dark:bg-black/50 backdrop-blur-sm mt-0 h-full">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <Calculator className="h-6 w-6 text-emerald-600 dark:text-emerald-400 group-hover:text-white" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-bold">Puan Hesaplama</h3>
                          <p className="text-sm text-muted-foreground">LGS ve YKS (TYT-AYT) puanını anında hesapla.</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </CardContent>
                  </Card>
                </Link>
              </div>
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
