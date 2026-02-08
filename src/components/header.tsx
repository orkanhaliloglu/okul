"use client";

import Link from "next/link";
import { GraduationCap, School, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="mr-4 hidden md:flex">
                    <Link className="mr-6 flex items-center space-x-2" href="/">
                        <GraduationCap className="h-6 w-6" />
                        <span className="hidden font-bold sm:inline-block">Okul Bul</span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">Ana Sayfa</Link>
                        <Link href="/lgs-tercih-robotu" className="transition-colors hover:text-foreground/80 text-foreground/60">Lise Bul</Link>
                        <Link href="/yks-tercih-robotu" className="transition-colors hover:text-foreground/80 text-foreground/60">Üniversite Bul</Link>
                        <Link href="/?tab=calculator" className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1">
                            <Calculator className="h-4 w-4" /> Puan Hesapla
                        </Link>
                    </nav>
                </div>

                {/* Mobile Menu Placeholder - For now just basic structure */}
                <div className="flex md:hidden mr-2">
                    <Link className="flex items-center space-x-2" href="/">
                        <GraduationCap className="h-6 w-6" />
                        <span className="font-bold">Okul Bul</span>
                    </Link>
                </div>

                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <nav className="flex items-center">
                        {/* Future auth buttons or theme toggle can go here */}
                    </nav>
                </div>
            </div>
        </header>
    );
}
