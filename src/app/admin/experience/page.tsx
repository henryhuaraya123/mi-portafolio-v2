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
import { Plus, Pencil, Trash2, ArrowLeft, Briefcase, Calendar } from "lucide-react"
import { toast } from "sonner"
import type { Experience } from "@/types/database.types"
import Link from "next/link"

export default function ExperienceAdminPage() {
    const [experience, setExperience] = useState<Experience[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<Experience | null>(null)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const [formData, setFormData] = useState({
        company: "",
        position: "",
        start_date: "",
        end_date: "",
        description: "",
        display_order: 0,
    })

    useEffect(() => {
        fetchExperience()
    }, [])

    const fetchExperience = async () => {
        try {
            const response = await fetch("/api/experience")
            if (!response.ok) {
                throw new Error("Error al cargar experiencia")
            }
            const data = await response.json()
            setExperience(data)
        } catch (error) {
            toast.error("Error al cargar experiencia")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            if (editingItem) {
                const response = await fetch("/api/experience", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: editingItem.id, ...formData }),
                })

                if (!response.ok) {
                    const error = await response.json()
                    throw new Error(error.details || "Error al actualizar")
                }
                toast.success("Experiencia actualizada correctamente")
            } else {
                const response = await fetch("/api/experience", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                })

                if (!response.ok) {
                    const error = await response.json()
                    throw new Error(error.details || "Error al crear")
                }
                toast.success("Experiencia creada correctamente")
            }

            setIsDialogOpen(false)
            resetForm()
            fetchExperience()
            router.refresh()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error al guardar")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEdit = (item: Experience) => {
        setEditingItem(item)
        setFormData({
            company: item.company,
            position: item.position,
            start_date: item.start_date,
            end_date: item.end_date || "",
            description: item.description || "",
            display_order: item.display_order,
        })
        setIsDialogOpen(true)
    }

    const handleDelete = async () => {
        if (!deleteId) return

        try {
            const response = await fetch(`/api/experience?id=${deleteId}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                throw new Error("Error al eliminar")
            }

            toast.success("Experiencia eliminada correctamente")
            fetchExperience()
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
            company: "",
            position: "",
            start_date: "",
            end_date: "",
            description: "",
            display_order: experience.length,
        })
        setEditingItem(null)
    }

    const openNewDialog = () => {
        resetForm()
        setIsDialogOpen(true)
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
        })
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
                            <h1 className="text-2xl font-heading font-bold">Gestión de Experiencia</h1>
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={openNewDialog} className="bg-gradient-to-r from-green-400 to-blue-500">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nueva Experiencia
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingItem ? "Editar Experiencia" : "Nueva Experiencia"}
                                    </DialogTitle>
                                    <DialogDescription>
                                        Completa los datos de la experiencia laboral
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="company">Empresa *</Label>
                                        <Input
                                            id="company"
                                            value={formData.company}
                                            onChange={(e) =>
                                                setFormData({ ...formData, company: e.target.value })
                                            }
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="position">Cargo/Posición *</Label>
                                        <Input
                                            id="position"
                                            value={formData.position}
                                            onChange={(e) =>
                                                setFormData({ ...formData, position: e.target.value })
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
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Dejar vacío si es trabajo actual
                                            </p>
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
                                            rows={4}
                                            placeholder="Describe tus responsabilidades y logros..."
                                        />
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
                ) : experience.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-muted-foreground">
                            No hay registros de experiencia. Crea uno nuevo para comenzar.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {experience.map((item) => (
                            <Card key={item.id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="font-heading flex items-center gap-2">
                                                <Briefcase className="h-5 w-5 text-primary" />
                                                {item.position}
                                            </CardTitle>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {item.company}
                                            </p>
                                            <Badge variant="outline" className="mt-2">
                                                <Calendar className="mr-1 h-3 w-3" />
                                                {formatDate(item.start_date)} -{" "}
                                                {item.end_date ? formatDate(item.end_date) : "Presente"}
                                            </Badge>
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
                                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                                            {item.description}
                                        </p>
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
