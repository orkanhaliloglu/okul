import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://okultercihi.site'

    // Static routes
    const routes = [
        '',
        '/lgs-tercih-robotu',
        '/yks-tercih-robotu',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.9,
    }))

    return routes
}
