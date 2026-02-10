'use client';

import { useEffect } from 'react';
import { Button } from "@/components/ui/button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to console
        console.error("Page Error:", error);
    }, [error]);

    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center p-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Bir şeyler ters gitti!</h2>
            <p className="mb-6 text-muted-foreground max-w-md">
                Sayfa yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
            </p>
            <div className="bg-muted p-4 rounded-md mb-6 w-full max-w-lg overflow-auto text-left text-xs font-mono">
                {error.message}
            </div>
            <Button onClick={() => reset()}>
                Tekrar Dene
            </Button>
        </div>
    );
}
