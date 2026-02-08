import { MetadataRoute } from 'next';
import { highSchools, universities } from '@/data/mock-data';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://okul-bul.vercel.app'; // Change this to your real domain when purchased

    // Static routes
    const routes = [
        '',
        '/lgs-tercih-robotu',
        '/yks-tercih-robotu',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }));

    // High School Routes
    const highSchoolRoutes = highSchools.map((school) => ({
        url: `${baseUrl}/lise/${school.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // University Routes
    const universityRoutes = universities.map((school) => ({
        url: `${baseUrl}/universite/${school.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [...routes, ...highSchoolRoutes, ...universityRoutes];
}
