import { SearchView } from "@/components/search-view";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "LGS Tercih Robotu 2024 - 2025 | Lise Taban Puanları",
    description: "2024 ve 2025 LGS puanına göre lise hesaplama ve tercih robotu. İstanbul, Ankara ve İzmir'deki tüm liselerin güncel taban puanları ve yüzdelik dilimleri.",
};

export default function LgsTercihRobotuPage() {
    return (
        <Suspense fallback={<div className="container py-12 text-center">Lise verileri yükleniyor...</div>}>
            <SearchView initialType="lise" />
        </Suspense>
    );
}
