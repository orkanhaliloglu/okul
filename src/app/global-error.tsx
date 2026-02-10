'use client';

import { useEffect } from 'react';
import { Button } from "@/components/ui/button";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <html>
            <body>
                <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
                    <h2 className="text-2xl font-bold mb-4">Bir şeyler ters gitti! (Global)</h2>
                    <p className="mb-6 text-muted-foreground">{error.message || "Bilinmeyen bir hata oluştu."}</p>
                    <Button onClick={() => reset()}>
                        Tekrar Dene
                    </Button>
                </div>
            </body>
        </html>
    );
}
