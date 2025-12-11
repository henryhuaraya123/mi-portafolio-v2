"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
import { Plus, Pencil, Trash2, ArrowLeft, Upload, Award, FileText } from "lucide-react"
import { toast } from "sonner"
import type { Education } from "@/types/database.types"
import Link from "next/link"

export default function EducationAdminPage() {
    const [education, setEducation] = useState<Education[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<Education | null>(null)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const router = useRouter()

    const [formData, setFormData] = useState({
        institution: "",
        degree_or_course: "",
        start_date: "",
        end_date: "",
        description: "",
        certificate_url: "",
        display_order: 0,
    })

    useEffect(() => {
        fetchEducation()
    }, [])

    const fetchEducation = async () => {
        try {
            const response = await fetch("/api/education")
            if (!response.ok) {
                throw new Error("Error al cargar educación")
            }
            const data = await response.json()
            setEducation(data)
        } catch (error) {
            toast.error("Error al cargar educación")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.type !== "application/pdf") {
            toast.error("Solo se permiten archivos PDF")
            return
        }

        setIsUploading(true)
        const formData = new FormData()
        formData.append("file", file)
        formData.append("folder", "certificates")

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            if (response.ok) {
                const { url } = await response.json()
                setFormData((prev) => ({ ...prev, certificate_url: url }))
                toast.success("Certificado subido correctamente")
            } else {
                throw new Error("Error al subir archivo")
            }
        } catch (error) {
            toast.error("Error al subir el certificado")
        } finally {
            setIsUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            if (editingItem) {
                const response = await fetch("/api/education", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: editingItem.id, ...formData }),
                })

                if (!response.ok) {
                    const error = await response.json()
                    throw new Error(error.details || "Error al actualizar")
                }
                toast.success("Educación actualizada correctamente")
            } else {
                const response = await fetch("/api/education", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                })

                if (!response.ok) {
                    const error = await response.json()
                    throw new Error(error.details || "Error al crear")
                }
                toast.success("Educación creada correctamente")
            }

            setIsDialogOpen(false)
            resetForm()
            fetchEducation()
            router.refresh()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error al guardar")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEdit = (item: Education) => {
        setEditingItem(item)
        setFormData({
            institution: item.institution,
            degree_or_course: item.degree_or_course,
            start_date: item.start_date,
            end_date: item.end_date || "",
            description: item.description || "",
            certificate_url: item.certificate_url || "",
            display_order: item.display_order,
        })
        setIsDialogOpen(true)
    }

    const handleDelete = async () => {
        if (!deleteId) return

        try {
            const response = await fetch(`/api/education?id=${deleteId}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                throw new Error("Error al eliminar")
            }

            toast.success("Educación eliminada correctamente")
            fetchEducation()
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
            institution: "",
            degree_or_course: "",
            start_date: "",
            end_date: "",
            description: "",
            certificate_url: "",
            display_order: education.length,
        })
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
                            <h1 className="text-2xl font-heading font-bold">Gestión de Educación</h1>
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={openNewDialog} className="bg-gradient-to-r from-green-400 to-blue-500">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nueva Educación
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingItem ? "Editar Educación" : "Nueva Educación"}
                                    </DialogTitle>
                                    <DialogDescription>
                                        Completa los datos de la formación académica
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="institution">Institución *</Label>
                                        <Input
                                            id="institution"
                                            value={formData.institution}
                                            onChange={(e) =>
                                                setFormData({ ...formData, institution: e.target.value })
                                            }
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="degree_or_course">Título/Curso *</Label>
                                        <Input
                                            id="degree_or_course"
                                            value={formData.degree_or_course}
                                            onChange={(e) =>
                                                setFormData({ ...formData, degree_or_course: e.target.value })
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="start_date">Fecha de Inicio *</Label>
                                            <Input
                                                id="start_date"
                                                type="date"
                                                value={formData.start_date}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, start_date: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="end_date">Fecha de Fin</Label>
                                            <Input
                                                id="end_date"
                                                type="date"
                                                value={formData.end_date}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, end_date: e.target.value })
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="description">Descripción</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) =>
                                                setFormData({ ...formData, description: e.target.value })
                                            }
                                            rows={3}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="certificate">Certificado (PDF)</Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                id="certificate"
                                                type="file"
                                                accept=".pdf"
                                                onChange={handleFileUpload}
                                                disabled={isUploading}
                                            />
                                            {isUploading && <span className="text-sm text-muted-foreground">Subiendo...</span>}
                                        </div>
                                        {formData.certificate_url && (
                                            <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                                                <FileText className="h-4 w-4" />
                                                <a
                                                    href={formData.certificate_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="underline"
                                                >
                                                    Ver certificado actual
                                                </a>
                                            </div>
                                        )}
                                    </div>

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
                ) : education.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-muted-foreground">
                            No hay registros de educación. Crea uno nuevo para comenzar.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {education.map((item) => (
                            <Card key={item.id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="flex items-center gap-2">
                                                {item.degree_or_course}
                                                {item.certificate_url && (
                                                    <Award className="h-5 w-5 text-green-500" />
                                                )}
                                            </CardTitle>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {item.institution}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(item.start_date).toLocaleDateString("es-ES")} -{" "}
                                                {item.end_date
                                                    ? new Date(item.end_date).toLocaleDateString("es-ES")
                                                    : "Presente"}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleEdit(item)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => setDeleteId(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                {item.description && (
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                    </CardContent>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente este registro.
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
