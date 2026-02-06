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
                <div className="absolute inset-0 bg-black/50 z-10" /> {/* Fondo base oscuro */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-20" /> {/* Gradiente lateral más fuerte para proteger el texto */}

                {isVideo || !heroBgUrl ? (
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover scale-105" // Ligero zoom para evitar bordes
                        poster={!isVideo && heroBgUrl ? heroBgUrl : undefined}
                    >
                        <source src={videoSource || ""} type="video/mp4" />
                    </video>
                ) : (
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${heroBgUrl})` }}
                    />
                )}
            </div>

            {/* Decoraciones de Fondo */}
            <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-20 -right-20 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"
                />
            </div>

            {/* Content */}
            <div className="container relative z-30 mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="space-y-6">
                            <h1 className="text-5xl sm:text-5xl lg:text-5xl font-heading font-black mb-5 leading-[0.9] tracking-tighter">
                                <span className="block text-white/90 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                                    Hola, soy
                                </span>
                                <span className="block text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] mt-2">
                                    Henry Denilson
                                </span>
                                <span className="block text-blue-500 mt-4 drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                                    {typedRole}
                                    <span className="animate-pulse text-white ml-2">_</span>
                                </span>
                            </h1>

                            <p className="text-lg sm:text-xl md:text-2xl text-white/70 max-w-xl leading-relaxed font-light drop-shadow-md">
                                {headline}
                            </p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4"
                            >
                                {/* Botón Proyectos Programador - Azul */}
                                <Button
                                    size="lg"
                                    onClick={() =>
                                        document
                                            .querySelector("#projects")
                                            ?.scrollIntoView({ behavior: "smooth" })
                                    }
                                    className="bg-blue-600 text-white hover:bg-blue-700 font-bold px-6 sm:px-8 h-12 sm:h-14 text-sm sm:text-base rounded-lg shadow-[0_10px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_30px_rgba(37,99,235,0.4)] transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
                                >
                                    <span className="hidden sm:inline">Ver Proyectos como programador</span>
                                    <span className="sm:hidden">Proyectos Programador</span>
                                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                                </Button>

                                {/* Botón Proyectos Analista - Morado */}
                                <Button
                                    size="lg"
                                    className="bg-purple-600 text-white hover:bg-purple-700 font-bold px-6 sm:px-8 h-12 sm:h-14 text-sm sm:text-base rounded-lg shadow-[0_10px_20px_rgba(147,51,234,0.3)] hover:shadow-[0_15px_30px_rgba(147,51,234,0.4)] transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
                                    asChild
                                >
                                    <a href="https://henryhuaraya123.github.io/data/" target="_blank" rel="noopener noreferrer">
                                        <span className="hidden sm:inline">Ver Proyectos como analista</span>
                                        <span className="sm:hidden">Proyectos Analista</span>
                                        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                                    </a>
                                </Button>

                                {/* Botón CV - Verde */}
                                {cvUrl && (
                                    <Button
                                        size="lg"
                                        className="bg-green-600 text-white hover:bg-green-700 font-bold px-6 sm:px-8 h-12 sm:h-14 text-sm sm:text-base rounded-lg shadow-[0_10px_20px_rgba(22,163,74,0.3)] hover:shadow-[0_15px_30px_rgba(22,163,74,0.4)] transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
                                        asChild
                                    >
                                        <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                                            <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
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
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center gap-2 cursor-pointer"
                onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}
            >
                <span className="text-xs text-white/50 uppercase tracking-[0.3em] font-bold">Desliza</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ArrowRight className="h-6 w-6 text-blue-500 rotate-90" />
                </motion.div>
            </motion.div>
        </section>
    )
}
