import { SearchView } from "@/components/search-view";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "YKS Tercih Robotu 2024 - 2025 | Üniversite Taban Puanları",
    description: "YKS (TYT-AYT) puanına ve başarı sıralamasına göre üniversite tercih robotu. 2025 güncel YÖK Atlas verileriyle üniversite arama.",
};

export default function YksTercihRobotuPage() {
    return (
        <Suspense fallback={<div className="container py-12 text-center">Üniversite verileri yükleniyor...</div>}>
            <SearchView initialType="universite" />
        </Suspense>
    );
}
