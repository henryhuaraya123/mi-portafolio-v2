import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/'], // Protegemos rutas privadas de la indexación
        },
        sitemap: 'https://mi-portafolio-v2-henna.vercel.app/sitemap.xml', // Ajustar con dominio real
    }
}
