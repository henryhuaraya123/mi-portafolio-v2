"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Award, FileCheck } from "lucide-react"
import { motion } from "framer-motion"
import type { Education } from "@/types/database.types"

interface EducationSectionProps {
    education?: Education[]
}

export function EducationSection({ education = [] }: EducationSectionProps) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
        })
    }

    return (
        <section id="education" className="py-20 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl sm:text-4xl font-heading font-bold text-center mb-4">
                        <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Educación</span>
                    </h2>
                    <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                        Mi formación académica y certificaciones profesionales
                    </p>

                    {education.length === 0 ? (
                        <div className="text-center text-muted-foreground py-12">
                            <p>No hay información de educación disponible.</p>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto space-y-6">
                            {education.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Card className="relative overflow-hidden border-l-4 border-l-green-400">

                                        <CardHeader className="pb-2">
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                                <div className="flex-1">
                                                    <CardTitle className="font-heading text-xl md:text-2xl mb-2">
                                                        {item.degree_or_course}
                                                    </CardTitle>
                                                    <CardDescription className="flex items-center gap-2 text-base">
                                                        <MapPin className="h-4 w-4 text-green-500" />
                                                        <span className="font-semibold text-foreground/80">{item.institution}</span>
                                                    </CardDescription>
                                                </div>
                                                <Badge variant="secondary" className="shrink-0 self-start md:self-center bg-secondary/50">
                                                    <Calendar className="mr-2 h-3 w-3" />
                                                    {formatDate(item.start_date)} -{" "}
                                                    {item.end_date ? formatDate(item.end_date) : "Presente"}
                                                </Badge>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="pb-4">
                                            {item.description && (
                                                <p className="text-muted-foreground mb-4 leading-relaxed">{item.description}</p>
                                            )}
                                        </CardContent>

                                        {item.certificate_url && (
                                            <CardFooter className="pt-0 flex justify-end">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="group border-green-500/30 hover:border-green-500 hover:bg-green-500/10 text-green-600 dark:text-green-400 transition-all duration-300"
                                                    asChild
                                                >
                                                    <a
                                                        href={item.certificate_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <FileCheck className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                                                        Documento Sustentatorio
                                                    </a>
                                                </Button>
                                            </CardFooter>
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
