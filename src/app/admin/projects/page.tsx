"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2, ArrowLeft, Upload, Image as ImageIcon, X } from "lucide-react"
import { toast } from "sonner"
import type { Project, ProjectImage } from "@/types/database.types"
import Link from "next/link"
import Image from "next/image"

interface ProjectWithImages extends Project {
    project_images?: ProjectImage[]
}

export default function ProjectsAdminPage() {
    const [projects, setProjects] = useState<ProjectWithImages[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<ProjectWithImages | null>(null)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadedImages, setUploadedImages] = useState<Array<{ url: string; isMain: boolean }>>([])
    const router = useRouter()

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        tech_stack: "",
        repo_url: "",
        live_url: "",
        display_order: 0,
    })

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            const response = await fetch("/api/projects")
            if (!response.ok) {
                throw new Error("Error al cargar proyectos")
            }
            const data = await response.json()
            setProjects(data)
        } catch (error) {
            toast.error("Error al cargar proyectos")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setIsUploading(true)
        const newImages: Array<{ url: string; isMain: boolean }> = []

        for (let i = 0; i < files.length; i++) {
            const file = files[i]

            if (!file.type.startsWith("image/")) {
                toast.error(`${file.name} no es una imagen válida`)
                continue
            }

            const formData = new FormData()
            formData.append("file", file)
            formData.append("folder", "projects")

            try {
                const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                })

                if (response.ok) {
                    const { url } = await response.json()
                    newImages.push({ url, isMain: uploadedImages.length === 0 && i === 0 })
                } else {
                    throw new Error("Error al subir imagen")
                }
            } catch (error) {
                toast.error(`Error al subir ${file.name}`)
            }
        }

        setUploadedImages([...uploadedImages, ...newImages])
        setIsUploading(false)
        if (newImages.length > 0) {
            toast.success(`${newImages.length} imagen(es) subida(s) correctamente`)
        }
    }

    const toggleMainImage = (index: number) => {
        const updated = uploadedImages.map((img, i) => ({
            ...img,
            isMain: i === index,
        }))
        setUploadedImages(updated)
    }

    const removeImage = (index: number) => {
        setUploadedImages(uploadedImages.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const techStackArray = formData.tech_stack
                .split(",")
                .map((tech) => tech.trim())
                .filter((tech) => tech.length > 0)

            const projectData = {
                name: formData.name,
                description: formData.description,
                tech_stack: techStackArray,
                repo_url: formData.repo_url || null,
                live_url: formData.live_url || null,
                display_order: formData.display_order,
            }

            if (editingItem) {
                // Update existing project
                const response = await fetch("/api/projects", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: editingItem.id,
                        projectData,
                        images: uploadedImages,
                    }),
                })

                if (!response.ok) {
                    const error = await response.json()
                    throw new Error(error.details || "Error al actualizar")
                }
            } else {
                // Create new project
                const response = await fetch("/api/projects", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        projectData,
                        images: uploadedImages,
                    }),
                })

                if (!response.ok) {
                    const error = await response.json()
                    throw new Error(error.details || "Error al crear")
                }
            }

            toast.success(editingItem ? "Proyecto actualizado" : "Proyecto creado")
            setIsDialogOpen(false)
            resetForm()
            fetchProjects()
            router.refresh()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error al guardar el proyecto")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEdit = (item: ProjectWithImages) => {
        setEditingItem(item)
        setFormData({
            name: item.name,
            description: item.description,
            tech_stack: item.tech_stack?.join(", ") || "",
            repo_url: item.repo_url || "",
            live_url: item.live_url || "",
            display_order: item.display_order,
        })
        setUploadedImages(
            item.project_images?.map((img) => ({
                url: img.image_url,
                isMain: img.is_main,
            })) || []
        )
        setIsDialogOpen(true)
    }

    const handleDelete = async () => {
        if (!deleteId) return

        try {
            const response = await fetch(`/api/projects?id=${deleteId}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                throw new Error("Error al eliminar")
            }

            toast.success("Proyecto eliminado correctamente")
            fetchProjects()
            router.refresh()
        } catch (error) {
            toast.error("Error al eliminar")
            console.error(error)
        } finally {
            setDeleteId(null)
        }
    }

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            tech_stack: "",
            repo_url: "",
            live_url: "",
            display_order: projects.length,
        })
        setUploadedImages([])
        setEditingItem(null)
    }

    const openNewDialog = () => {
        resetForm()
        setIsDialogOpen(true)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted">
            <header className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" asChild>
                                <Link href="/admin">
                                    <ArrowLeft className="h-5 w-5" />
                                </Link>
                            </Button>
                            <h1 className="text-2xl font-heading font-bold">Gestión de Proyectos</h1>
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={openNewDialog} className="bg-gradient-to-r from-green-400 to-blue-500">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nuevo Proyecto
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingItem ? "Editar Proyecto" : "Nuevo Proyecto"}
                                    </DialogTitle>
                                    <DialogDescription>
                                        Completa los datos del proyecto
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Nombre del Proyecto *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="description">Descripción *</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={3}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="tech_stack">Tecnologías (separadas por comas) *</Label>
                                        <Textarea
                                            id="tech_stack"
                                            value={formData.tech_stack}
                                            onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                                            placeholder="React, Next.js, TypeScript, Tailwind CSS"
                                            rows={2}
                                            required
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Ejemplo: React, Next.js, TypeScript
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="repo_url">URL del Repositorio</Label>
                                            <Input
                                                id="repo_url"
                                                type="url"
                                                value={formData.repo_url}
                                                onChange={(e) => setFormData({ ...formData, repo_url: e.target.value })}
                                                placeholder="https://github.com/..."
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="live_url">URL del Demo/Live</Label>
                                            <Input
                                                id="live_url"
                                                type="url"
                                                value={formData.live_url}
                                                onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="images">Imágenes del Proyecto</Label>
                                        <Input
                                            id="images"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleFileUpload}
                                            disabled={isUploading}
                                        />
                                        {isUploading && (
                                            <p className="text-sm text-muted-foreground mt-1">Subiendo imágenes...</p>
                                        )}
                                    </div>

                                    {uploadedImages.length > 0 && (
                                        <div>
                                            <Label>Imágenes Subidas</Label>
                                            <div className="grid grid-cols-3 gap-4 mt-2">
                                                {uploadedImages.map((img, index) => (
                                                    <div key={index} className="relative group">
                                                        <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-border">
                                                            <Image
                                                                src={img.url}
                                                                alt={`Preview ${index + 1}`}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div className="absolute top-2 right-2 flex gap-1">
                                                            <Button
                                                                type="button"
                                                                size="icon"
                                                                variant={img.isMain ? "default" : "secondary"}
                                                                className="h-6 w-6"
                                                                onClick={() => toggleMainImage(index)}
                                                                title="Marcar como principal"
                                                            >
                                                                <ImageIcon className="h-3 w-3" />
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                size="icon"
                                                                variant="destructive"
                                                                className="h-6 w-6"
                                                                onClick={() => removeImage(index)}
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                        {img.isMain && (
                                                            <Badge className="absolute bottom-2 left-2 text-xs">
                                                                Principal
                                                            </Badge>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <Label htmlFor="display_order">Orden de Visualización</Label>
                                        <Input
                                            id="display_order"
                                            type="number"
                                            value={formData.display_order}
                                            onChange={(e) =>
                                                setFormData({ ...formData, display_order: parseInt(e.target.value) })
                                            }
                                        />
                                    </div>

                                    <div className="flex gap-2 justify-end">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsDialogOpen(false)}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button type="submit" disabled={isSubmitting}>
                                            {isSubmitting ? "Guardando..." : "Guardar"}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {isLoading ? (
                    <div className="text-center py-12">Cargando...</div>
                ) : projects.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-muted-foreground">
                            No hay proyectos. Crea uno nuevo para comenzar.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => {
                            const mainImage = project.project_images?.find((img) => img.is_main)
                            const imageUrl = mainImage?.image_url || project.project_images?.[0]?.image_url

                            return (
                                <Card key={project.id} className="overflow-hidden">
                                    {imageUrl && (
                                        <div className="relative h-48 bg-muted">
                                            <Image
                                                src={imageUrl}
                                                alt={project.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="font-heading">{project.name}</CardTitle>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => handleEdit(project)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => setDeleteId(project.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                            {project.description}
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                            {project.tech_stack?.slice(0, 3).map((tech, i) => (
                                                <Badge key={i} variant="secondary" className="text-xs">
                                                    {tech}
                                                </Badge>
                                            ))}
                                            {project.tech_stack && project.tech_stack.length > 3 && (
                                                <Badge variant="secondary" className="text-xs">
                                                    +{project.tech_stack.length - 3}
                                                </Badge>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </main>

            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente este proyecto y todas sus imágenes.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
