"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Briefcase } from "lucide-react"
import { motion } from "framer-motion"
import type { Experience } from "@/types/database.types"

interface ExperienceSectionProps {
    experience?: Experience[]
}

export function ExperienceSection({ experience = [] }: ExperienceSectionProps) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
        })
    }

    return (
        <section id="experience" className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl sm:text-4xl font-heading font-bold text-center mb-4">
                        <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Experiencia</span>
                    </h2>
                    <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                        Mi trayectoria profesional
                    </p>

                    {experience.length === 0 ? (
                        <div className="text-center text-muted-foreground py-12">
                            <p>No hay información de experiencia disponible.</p>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto space-y-6">
                            {experience.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Card className="relative overflow-hidden">
                                        {/* Timeline dot */}
                                        <div className="absolute left-0 top-8 w-1 h-full bg-gradient-to-b from-green-400 to-blue-500" />

                                        <CardHeader className="pl-8">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                                <div className="flex-1">
                                                    <CardTitle className="font-heading">{item.position}</CardTitle>
                                                    <CardDescription className="flex items-center gap-2 mt-1">
                                                        <Briefcase className="h-4 w-4" />
                                                        {item.company}
                                                    </CardDescription>
                                                </div>
                                                <Badge variant="outline" className="shrink-0">
                                                    <Calendar className="mr-1 h-3 w-3" />
                                                    {formatDate(item.start_date)} -{" "}
                                                    {item.end_date ? formatDate(item.end_date) : "Presente"}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        {item.description && (
                                            <CardContent className="pl-8">
                                                <p className="text-muted-foreground whitespace-pre-line">{item.description}</p>
                                            </CardContent>
                                        )}
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    )
}
