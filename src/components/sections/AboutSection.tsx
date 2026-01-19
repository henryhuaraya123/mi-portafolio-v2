"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { Code2, Cpu, Rocket, Sparkles } from "lucide-react"

interface AboutSectionProps {
    content?: string
    avatarUrl?: string
}

export function AboutSection({
    content = "Soy un desarrollador apasionado por la tecnología y la creación de soluciones innovadoras.",
    avatarUrl,
}: AboutSectionProps) {
    const highlights = [
        { icon: Code2, label: "Clean Code", color: "text-blue-500" },
        { icon: Cpu, label: "Optimización", color: "text-indigo-500" },
        { icon: Rocket, label: "Escalabilidad", color: "text-blue-400" },
        { icon: Sparkles, label: "Innovación", color: "text-indigo-400" },
    ]

    return (
        <section id="about" className="py-24 relative overflow-hidden bg-background">
            {/* Background Decorations */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-heading font-black mb-4 tracking-tight">
                            Sobre <span className="text-blue-600 dark:text-blue-400">Mí</span>
                        </h2>
                        <div className="h-1.5 w-20 bg-blue-600 mx-auto rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]" />
                    </div>

                    <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            {/* Avatar Column */}
                            <motion.div
                                className="lg:col-span-4 flex justify-center"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                            >
                                <div className="relative group">
                                    <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                                    <Avatar className="w-64 h-64 border-2 border-white/10 shadow-2xl relative">
                                        <AvatarImage src={avatarUrl} alt="Henry Denilson Huaraya Chipana" className="object-cover" />
                                        <AvatarFallback className="text-4xl font-heading bg-muted">
                                            HD
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-4 -right-4 bg-blue-600 p-4 rounded-2xl shadow-xl shadow-blue-500/20">
                                        <Rocket className="h-8 w-8 text-white" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Content Column */}
                            <div className="lg:col-span-8 space-y-8">
                                <Card className="border-border/40 bg-card/60 backdrop-blur-xl shadow-2xl">
                                    <CardContent className="p-8 md:p-10">
                                        <div
                                            className="text-lg text-foreground/80 leading-relaxed text-justify whitespace-pre-line"
                                            dangerouslySetInnerHTML={{ __html: content }}
                                        />
                                    </CardContent>
                                </Card>

                                {/* Highlights Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {highlights.map((item, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 * idx }}
                                            viewport={{ once: true }}
                                            className="p-4 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md hover:border-blue-500/50 transition-colors text-center group"
                                        >
                                            <item.icon className={`h-6 w-6 mx-auto mb-2 ${item.color} group-hover:scale-110 transition-transform`} />
                                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{item.label}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
