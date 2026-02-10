import { ScoreWizard } from "@/components/score-wizard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "LGS & YKS Puan Hesaplama Robotu 2025",
    description: "2025 LGS puan hesaplama ve YKS (TYT-AYT) puan hesaplama aracı. Güncel katsayılarla netlerinizi girin, tahmini puanınızı ve sıralamanızı öğrenin.",
};

export default function PuanHesaplamaPage() {
    return (
        <div className="container py-8 md:py-12 space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Puan Hesaplama Robotu</h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                    LGS veya YKS deneme netlerinizi girin, güncel katsayılarla tahmini puanınızı hemen öğrenin.
                </p>
            </div>

            <div className="max-w-4xl mx-auto">
                <ScoreWizard />
            </div>
        </div>
    );
}
