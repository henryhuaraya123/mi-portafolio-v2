"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"

interface AboutSectionProps {
    content?: string
    avatarUrl?: string
}

export function AboutSection({
    content = "Soy un desarrollador apasionado por la tecnología y la creación de soluciones innovadoras.",
    avatarUrl,
}: AboutSectionProps) {
    return (
        <section id="about" className="py-20 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl sm:text-4xl font-heading font-bold text-center mb-12">
                        Sobre <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Mí</span>
                    </h2>

                    <Card className="max-w-4xl mx-auto">
                        <CardContent className="p-8">
                            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                                <Avatar className="w-32 h-32 border-4 border-primary/20">
                                    <AvatarImage src={avatarUrl} alt="Henry Denilson Huaraya Chipana" />
                                    <AvatarFallback className="text-2xl font-heading">
                                        DEV
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1">
                                    <div
                                        className="text-foreground/90 leading-relaxed text-justify whitespace-pre-line"
                                        dangerouslySetInnerHTML={{ __html: content }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    )
}
