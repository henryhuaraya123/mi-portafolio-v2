"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Lock, Globe, ShieldAlert } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import type { Project, ProjectImage } from "@/types/database.types"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

interface ProjectWithImages extends Project {
    project_images?: ProjectImage[]
}

interface ProjectsSectionProps {
    projects?: ProjectWithImages[]
}

// Componente para la Tarjeta de Proyecto Individual
function ProjectCard({ project }: { project: ProjectWithImages }) {
    // Ordenar imágenes: main primero, luego por display_order
    const sortedImages = project.project_images?.sort((a, b) => {
        if (a.is_main) return -1
        if (b.is_main) return 1
        return (a.display_order || 0) - (b.display_order || 0)
    }) || []

    const hasMultipleImages = sortedImages.length > 1
    const mainImageUrl = sortedImages[0]?.image_url

    return (
        <Card className="h-full flex flex-col overflow-hidden group border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden bg-muted">
                {sortedImages.length > 0 ? (
                    hasMultipleImages ? (
                        <Carousel
                            className="w-full h-full"
                            plugins={[
                                Autoplay({
                                    delay: 4000 + Math.random() * 2000,
                                    stopOnInteraction: true,
                                })
                            ]}
                            opts={{
                                loop: true,
                            }}
                        >
                            <CarouselContent className="h-full">
                                {sortedImages.map((img) => (
                                    <CarouselItem key={img.id} className="h-full relative">
                                        <div className="relative w-full h-48">
                                            <Image
                                                src={img.image_url}
                                                alt={project.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            {/* Pequeños botones de navegación superpuestos */}
                            <div className="absolute bottom-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <CarouselPrevious className="static translate-y-0 translate-x-0 h-6 w-6 bg-background/50 hover:bg-background border-none" variant="ghost" />
                                <CarouselNext className="static translate-y-0 translate-x-0 h-6 w-6 bg-background/50 hover:bg-background border-none" variant="ghost" />
                            </div>
                        </Carousel>
                    ) : (
                        <div className="relative w-full h-48 group-hover:scale-105 transition-transform duration-500">
                            <Image
                                src={mainImageUrl!}
                                alt={project.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted/50 text-muted-foreground">
                        <span className="text-sm">Sin imagen</span>
                    </div>
                )}
            </div>

            <CardHeader>
                <CardTitle className="font-heading flex justify-between items-start gap-2">
                    <span title={project.name}>{project.name}</span>
                </CardTitle>
                <CardDescription className="text-justify">
                    {project.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <div className="flex flex-wrap gap-2">
                    {project.tech_stack?.map((tech, i) => (
                        <Badge key={i} variant="secondary" className="bg-secondary/50">
                            {tech}
                        </Badge>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pt-0 mt-auto">
                {(project.repo_url || project.live_url) ? (
                    <>
                        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-blue-500/80 mb-1">
                            <Globe className="h-3 w-3" />
                            Libre Acceso
                        </div>
                        <div className="flex gap-2 w-full">
                            {project.repo_url && (
                                <Button variant="outline" size="sm" asChild className="flex-1 border-border/50 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all">
                                    <a
                                        href={project.repo_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Github className="mr-2 h-4 w-4" />
                                        Código
                                    </a>
                                </Button>
                            )}
                            {project.live_url && (
                                <Button size="sm" asChild className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 border-0">
                                    <a
                                        href={project.live_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Demo
                                    </a>
                                </Button>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="w-full p-4 rounded-xl bg-muted/30 border border-dashed border-border/60 flex flex-col items-center text-center gap-2">
                        <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider">
                            <Lock className="h-3.5 w-3.5" />
                            Proyecto Privado
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-tight italic">
                            Acceso restringido por confidencialidad empresarial. Código y demo no disponibles.
                        </p>
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}

export function ProjectsSection({ projects = [] }: ProjectsSectionProps) {
    return (
        <section id="projects" className="py-24 bg-muted/20 relative">
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px] pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center"
                >
                    <h2 className="text-3xl sm:text-5xl font-heading font-bold mb-4">
                        Mis <span className="text-blue-700 dark:text-blue-400">Proyectos</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Explora mi portafolio de aplicaciones y desarrollos recientes.
                    </p>
                </motion.div>

                {projects.length === 0 ? (
                    <div className="text-center text-muted-foreground py-12 border-2 border-dashed border-border rounded-xl">
                        <p>No hay proyectos disponibles en este momento.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="h-full"
                            >
                                <ProjectCard project={project} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
