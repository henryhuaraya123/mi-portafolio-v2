"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, GraduationCap, FileText, ExternalLink, ChevronRight, Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Education } from "@/types/database.types"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"

interface EducationSectionProps {
    education?: Education[]
}

export function EducationSection({ education = [] }: EducationSectionProps) {
    const [selectedItem, setSelectedItem] = useState<Education | null>(education[0] || null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
        })
    }

    return (
        <section id="education" className="py-24 bg-background relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <h2 className="text-4xl sm:text-5xl font-heading font-black mb-4">
                        <span className="text-blue-600 dark:text-blue-400">Trayectoria</span> Académica
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Mi formación y certificaciones obtenidas
                    </p>
                </motion.div>

                {education.length === 0 ? (
                    <div className="text-center text-muted-foreground py-12">
                        <p>No hay información de educación disponible.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
                        {/* List Column */}
                        <div className="lg:col-span-5 space-y-4">
                            {education.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layoutId={`item-${item.id}`}
                                    onClick={() => setSelectedItem(item)}
                                    className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${selectedItem?.id === item.id
                                        ? "bg-blue-600/10 border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.1)]"
                                        : "bg-card/40 border-border/40 hover:border-blue-500/30 hover:bg-blue-600/5"
                                        }`}
                                >
                                    <div className="flex gap-4 items-start">
                                        <div className={`p-3 rounded-xl ${selectedItem?.id === item.id ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground"
                                            }`}>
                                            <GraduationCap className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-lg leading-tight truncate">{item.degree_or_course}</h3>
                                            <p className="text-sm text-muted-foreground font-medium mt-1">{item.institution}</p>
                                            <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground font-mono">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(item.start_date)} - {item.end_date ? formatDate(item.end_date) : "Pres."}
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronRight className={`h-5 w-5 mt-1 transition-transform ${selectedItem?.id === item.id ? "translate-x-1 text-blue-500" : "text-muted-foreground"
                                            }`} />
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Preview Column (Large Screens) */}
                        <div className="lg:col-span-7 hidden lg:block">
                            <AnimatePresence mode="wait">
                                {selectedItem && (
                                    <motion.div
                                        key={selectedItem.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="h-full flex flex-col bg-card/40 border border-border/40 rounded-3xl overflow-hidden backdrop-blur-sm"
                                    >
                                        <div className="p-8 pb-4">
                                            <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 mb-4 border-none">
                                                Detalles de Formación
                                            </Badge>
                                            <h3 className="text-3xl font-black mb-2">{selectedItem.degree_or_course}</h3>
                                            <div className="flex items-center gap-4 text-muted-foreground mb-6">
                                                <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full text-sm">
                                                    <MapPin className="h-4 w-4 text-blue-500" />
                                                    {selectedItem.institution}
                                                </div>
                                            </div>
                                            <p className="text-foreground/80 leading-relaxed mb-8 text-lg">
                                                {selectedItem.description || "Sin descripción adicional disponible."}
                                            </p>
                                        </div>

                                        <div className="mt-auto p-8 pt-0">
                                            {selectedItem.certificate_url ? (
                                                <div className="space-y-4">
                                                    <div className="relative group overflow-hidden rounded-2xl bg-muted aspect-video border border-border/50 flex flex-col items-center justify-center gap-3">
                                                        <FileText className="h-12 w-12 text-blue-500/40 group-hover:scale-110 transition-transform duration-500" />
                                                        <div className="text-center">
                                                            <p className="font-bold">Vista Previa Disponible</p>
                                                            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Certificado Oficial</p>
                                                        </div>
                                                        <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors duration-500 flex items-center justify-center">
                                                            <Button
                                                                onClick={() => setPreviewUrl(selectedItem.certificate_url!)}
                                                                className="opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 hover:bg-blue-700 shadow-xl"
                                                            >
                                                                <Search className="h-4 w-4 mr-2" />
                                                                Expandir Certificado
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full h-12 rounded-xl group border-blue-500/20 hover:border-blue-500/50"
                                                        asChild
                                                    >
                                                        <a href={selectedItem.certificate_url} target="_blank" rel="noopener noreferrer">
                                                            <ExternalLink className="mr-2 h-4 w-4 group-hover:rotate-45 transition-transform" />
                                                            Abrir en nueva pestaña
                                                        </a>
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="p-8 rounded-2xl bg-muted/30 border border-dashed border-border/60 text-center">
                                                    <p className="text-muted-foreground italic">No hay documento adjunto para esta formación.</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile Details Button */}
                        <div className="lg:hidden mt-4">
                            {selectedItem?.certificate_url && (
                                <Button
                                    className="w-full bg-blue-600 hover:bg-blue-700 h-14 rounded-2xl text-lg font-bold"
                                    onClick={() => setPreviewUrl(selectedItem.certificate_url!)}
                                >
                                    <Search className="mr-2 h-5 w-5" />
                                    Ver Certificado
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Global PDF Preview Dialog */}
            <Dialog open={!!previewUrl} onOpenChange={(open) => !open && setPreviewUrl(null)}>
                <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 overflow-hidden bg-black/90 border-blue-500/30">
                    <DialogHeader className="p-4 bg-background border-b border-border absolute top-0 w-full z-10">
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-500" />
                            {selectedItem?.degree_or_course}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedItem?.institution}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="w-full h-full pt-20">
                        {previewUrl && (
                            <object
                                data={previewUrl}
                                type="application/pdf"
                                className="w-full h-full border-none"
                            >
                                <div className="flex flex-col items-center justify-center h-full text-white p-6 text-center">
                                    <FileText className="h-16 w-16 mb-4 text-blue-400" />
                                    <p className="text-xl font-bold mb-2">Tu navegador no puede visualizar el PDF directamente</p>
                                    <p className="text-white/60 mb-6">Puedes descargarlo para verlo en tu dispositivo.</p>
                                    <Button asChild className="bg-blue-600">
                                        <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                                            Descargar Certificado
                                        </a>
                                    </Button>
                                </div>
                            </object>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    )
}
