"use client"

import { Button } from "@/components/ui/button"
import { Download, ArrowRight, MousePointer2 } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface HeroSectionProps {
    role?: string
    headline?: string
    cvUrl?: string | null
    heroBgUrl?: string | null
}

export function HeroSection({
    role = "Full Stack Developer",
    headline = "Construyendo experiencias web excepcionales",
    cvUrl,
    heroBgUrl,
}: HeroSectionProps) {
    const [typedRole, setTypedRole] = useState("")
    const fullText = role || "Full Stack Developer"

    // Typewriter effect
    useEffect(() => {
        setTypedRole("")
        let i = 0
        const interval = setInterval(() => {
            setTypedRole(fullText.slice(0, i + 1))
            i++
            if (i > fullText.length) clearInterval(interval)
        }, 100)
        return () => clearInterval(interval)
    }, [fullText])

    // Determinar si es video (si heroBgUrl tiene extension de video)
    const isVideo = heroBgUrl?.match(/\.(mp4|webm|ogg)$/i)
    // Placeholder video abstracto tech si no hay video configurado
    const videoSource = isVideo ? heroBgUrl : "https://cdn.pixabay.com/video/2019/04/20/22908-331622395_large.mp4"

    return (
        <section
            id="hero"
            className="relative min-h-screen flex items-center overflow-hidden"
        >
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-background/60 z-10" /> {/* Overlay oscuro más ligero */}
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" /> {/* Gradiente lateral para legibilidad */}

                {isVideo || !heroBgUrl ? (
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                        poster={!isVideo && heroBgUrl ? heroBgUrl : undefined}
                    >
                        <source src={videoSource || ""} type="video/mp4" />
                    </video>
                ) : (
                    // Fallback a imagen si se configuró una imagen explícitamente y no es video
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${heroBgUrl})` }}
                    />
                )}
            </div>

            {/* Decoraciones Animadas de Fondo - Más sutiles */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute top-20 right-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] z-10"
            />
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.1, 0.3, 0.1],
                }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute bottom-20 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] z-10"
            />

            {/* Content */}
            <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        {/* Contenido Ajustado - V4 Texto más pequeño */}
                        <div className="p-2 md:p-0">

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex items-center gap-3 mb-4"
                            >
                                <span className="h-[2px] w-8 bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]"></span>
                                <span className="text-green-400 font-mono text-xs tracking-[0.2em] uppercase font-bold drop-shadow-md">
                                    Disponible para proyectos
                                </span>
                            </motion.div>

                            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-heading font-bold mb-5 leading-tight drop-shadow-xl">
                                Hola, soy <br />
                                <span className="text-foreground relative inline-block">
                                    Henry Denilson
                                </span>
                                <br />
                                <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent filter drop-shadow-md">
                                    {typedRole}
                                    <span className="animate-pulse text-foreground ml-1">|</span>
                                </span>
                            </h1>

                            <p className="text-base sm:text-lg text-muted-foreground/90 mb-6 max-w-lg leading-relaxed font-light drop-shadow-md">
                                {headline}
                            </p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="flex flex-col sm:flex-row gap-4 items-start"
                            >
                                <Button
                                    size="lg"
                                    onClick={() =>
                                        document
                                            .querySelector("#projects")
                                            ?.scrollIntoView({ behavior: "smooth" })
                                    }
                                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 h-10 text-sm rounded-full shadow-lg hover:shadow-primary/30 transition-all hover:scale-105"
                                >
                                    Ver Mi Trabajo
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>

                                {/* Botón CV - Renderizado condicional */}
                                {cvUrl && (
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="border border-white/30 bg-background/10 backdrop-blur-md text-foreground hover:bg-white/20 font-semibold px-6 h-10 text-sm rounded-full transition-all hover:scale-105"
                                        asChild
                                    >
                                        <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                                            <Download className="mr-2 h-4 w-4" />
                                            Descargar CV
                                        </a>
                                    </Button>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer"
                onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}
            >
                <span className="text-xs text-muted-foreground uppercase tracking-widest">Desliza hacia abajo</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <MousePointer2 className="h-6 w-6 text-primary" />
                </motion.div>
            </motion.div>
        </section>
    )
}
