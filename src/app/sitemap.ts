import { MetadataRoute } from 'next'

// Esta URL base debería venir de variables de entorno en producción
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tu-dominio-vercel.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        // Si tuvieras más páginas públicas (ej. /blog), irían aquí
        // Las rutas de admin (/admin/...) usualmente no se incluyen en el sitemap
    ]
}
