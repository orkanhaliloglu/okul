"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("School Detail Page Error:", error);
    }, [error]);

    return (
        <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
            <h2 className="text-xl font-bold">Bir şeyler yanlış gitti!</h2>
            <p className="text-muted-foreground max-w-md text-center">
                Bu sayfa yüklenirken bir hata oluştu. Lütfen tekrar deneyin veya farklı bir okulu inceleyin.
            </p>
            <div className="p-4 bg-muted/50 rounded-lg text-sm font-mono text-red-500 overflow-auto max-w-lg mb-4">
                {error.message || "Bilinmeyen Hata"}
            </div>
            <Button onClick={() => reset()}>Tekrar Dene</Button>
        </div>
    );
}
