"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"
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
            <CardFooter className="flex gap-2 pt-0">
                {project.repo_url && (
                    <Button variant="outline" size="sm" asChild className="flex-1">
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
                    <Button size="sm" asChild className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0">
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
            </CardFooter>
        </Card>
    )
}

export function ProjectsSection({ projects = [] }: ProjectsSectionProps) {
    const shouldUseCarousel = projects.length > 4

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
                        Mis <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Proyectos</span>
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
                    <>
                        {shouldUseCarousel ? (
                            <div className="w-full px-4 md:px-12">
                                <Carousel
                                    opts={{
                                        align: "start",
                                        loop: true,
                                    }}
                                    plugins={[
                                        // Autoplay para la lista principal (opcional, lento)
                                        Autoplay({
                                            delay: 6000,
                                            stopOnInteraction: true,
                                        })
                                    ]}
                                    className="w-full"
                                >
                                    <CarouselContent className="-ml-4">
                                        {projects.map((project) => (
                                            <CarouselItem key={project.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                                <div className="p-1 h-full">
                                                    <ProjectCard project={project} />
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious className="hidden md:flex -left-12 h-12 w-12 border-primary/20 hover:border-primary text-primary" />
                                    <CarouselNext className="hidden md:flex -right-12 h-12 w-12 border-primary/20 hover:border-primary text-primary" />
                                </Carousel>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    </>
                )}
            </div>
        </section>
    )
}
