"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

const STUDENT_IMAGES = [
    "/images/random/student-1.png",
    "/images/random/student-2.png",
    "/images/random/student-3.png",
    "/images/random/student-4.png",
];

export function StudentBackground() {
    const pathname = usePathname();
    const [currentImageSrc, setCurrentImageSrc] = useState<string | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    // Initial mount and random selection
    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true);
            setCurrentImageSrc(STUDENT_IMAGES[Math.floor(Math.random() * STUDENT_IMAGES.length)]);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    // Change image on navigation
    useEffect(() => {
        if (mounted) {
            // Use setTimeout to avoid synchronous state update warning during render phase integration
            const timer = setTimeout(() => {
                const randomIdx = Math.floor(Math.random() * STUDENT_IMAGES.length);
                setCurrentImageSrc(STUDENT_IMAGES[randomIdx]);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [pathname, mounted]);

    // Process image to remove white background
    useEffect(() => {
        if (!currentImageSrc) return;

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = currentImageSrc;

        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");

            if (ctx) {
                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                // Loop through pixels
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];

                    // If pixel is close to white (brightness > 240), make it transparent
                    if (r > 240 && g > 240 && b > 240) {
                        data[i + 3] = 0; // Alpha = 0
                    }
                }

                ctx.putImageData(imageData, 0, 0);
                setProcessedImage(canvas.toDataURL());
            }
        };
    }, [currentImageSrc]);

    if (!mounted || !processedImage) return null;

    return (
        <div className="fixed bottom-0 right-0 z-0 pointer-events-none opacity-40 dark:opacity-20 h-[50vh] md:h-[80vh] w-auto">
            <img
                src={processedImage}
                alt="Öğrenci"
                className="h-full w-auto object-contain object-bottom transition-opacity duration-500 ease-in-out"
            />
        </div>
    );
}
