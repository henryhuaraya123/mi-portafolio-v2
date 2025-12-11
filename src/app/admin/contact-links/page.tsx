"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
import {
    Plus,
    Pencil,
    Trash2,
    ArrowLeft,
    Github,
    Linkedin,
    Twitter,
    Mail,
    Globe,
    Facebook,
    Instagram,
    Youtube,
    Link as LinkIcon
} from "lucide-react"
import { toast } from "sonner"
import type { ContactLink } from "@/types/database.types"
import Link from "next/link"

const availableIcons = [
    { value: "github", label: "GitHub", Icon: Github },
    { value: "linkedin", label: "LinkedIn", Icon: Linkedin },
    { value: "twitter", label: "Twitter/X", Icon: Twitter },
    { value: "mail", label: "Email", Icon: Mail },
    { value: "facebook", label: "Facebook", Icon: Facebook },
    { value: "instagram", label: "Instagram", Icon: Instagram },
    { value: "youtube", label: "YouTube", Icon: Youtube },
    { value: "globe", label: "Website", Icon: Globe },
    { value: "link", label: "Otro", Icon: LinkIcon },
]

export default function ContactLinksAdminPage() {
    const [contactLinks, setContactLinks] = useState<ContactLink[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<ContactLink | null>(null)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const [formData, setFormData] = useState({
        platform: "",
        url: "",
        icon_name: "link",
        display_order: 0,
    })

    useEffect(() => {
        fetchContactLinks()
    }, [])

    const fetchContactLinks = async () => {
        try {
            const response = await fetch("/api/contact-links")
            if (!response.ok) {
                throw new Error("Error al cargar enlaces")
            }
            const data = await response.json()
            setContactLinks(data)
        } catch (error) {
            toast.error("Error al cargar enlaces")
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
                const response = await fetch("/api/contact-links", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: editingItem.id, ...formData }),
                })

                if (!response.ok) {
                    const error = await response.json()
                    throw new Error(error.details || "Error al actualizar")
                }
                toast.success("Enlace actualizado correctamente")
            } else {
                const response = await fetch("/api/contact-links", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                })

                if (!response.ok) {
                    const error = await response.json()
                    throw new Error(error.details || "Error al crear")
                }
                toast.success("Enlace creado correctamente")
            }

            setIsDialogOpen(false)
            resetForm()
            fetchContactLinks()
            router.refresh()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error al guardar")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEdit = (item: ContactLink) => {
        setEditingItem(item)
        setFormData({
            platform: item.platform,
            url: item.url,
            icon_name: item.icon_name,
            display_order: item.display_order,
        })
        setIsDialogOpen(true)
    }

    const handleDelete = async () => {
        if (!deleteId) return

        try {
            const response = await fetch(`/api/contact-links?id=${deleteId}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                throw new Error("Error al eliminar")
            }

            toast.success("Enlace eliminado correctamente")
            fetchContactLinks()
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
            platform: "",
            url: "",
            icon_name: "link",
            display_order: contactLinks.length,
        })
        setEditingItem(null)
    }

    const openNewDialog = () => {
        resetForm()
        setIsDialogOpen(true)
    }

    const getIcon = (iconName: string) => {
        const icon = availableIcons.find((i) => i.value === iconName.toLowerCase())
        return icon ? icon.Icon : LinkIcon
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
                            <h1 className="text-2xl font-heading font-bold">Gestión de Enlaces de Contacto</h1>
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={openNewDialog} className="bg-gradient-to-r from-green-400 to-blue-500">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nuevo Enlace
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingItem ? "Editar Enlace" : "Nuevo Enlace"}
                                    </DialogTitle>
                                    <DialogDescription>
                                        Agrega un enlace a tus redes sociales o sitio web
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="platform">Plataforma/Nombre *</Label>
                                        <Input
                                            id="platform"
                                            value={formData.platform}
                                            onChange={(e) =>
                                                setFormData({ ...formData, platform: e.target.value })
                                            }
                                            placeholder="GitHub, LinkedIn, etc."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="url">URL *</Label>
                                        <Input
                                            id="url"
                                            type="url"
                                            value={formData.url}
                                            onChange={(e) =>
                                                setFormData({ ...formData, url: e.target.value })
                                            }
                                            placeholder="https://..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="icon_name">Icono *</Label>
                                        <Select
                                            value={formData.icon_name}
                                            onValueChange={(value) =>
                                                setFormData({ ...formData, icon_name: value })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona un icono" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableIcons.map((icon) => {
                                                    const Icon = icon.Icon
                                                    return (
                                                        <SelectItem key={icon.value} value={icon.value}>
                                                            <div className="flex items-center gap-2">
                                                                <Icon className="h-4 w-4" />
                                                                {icon.label}
                                                            </div>
                                                        </SelectItem>
                                                    )
                                                })}
                                            </SelectContent>
                                        </Select>
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
                ) : contactLinks.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-muted-foreground">
                            No hay enlaces de contacto. Crea uno nuevo para comenzar.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {contactLinks.map((item) => {
                            const Icon = getIcon(item.icon_name)
                            return (
                                <Card key={item.id}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="p-2 rounded-full bg-primary/10">
                                                    <Icon className="h-5 w-5 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <CardTitle className="font-heading text-base">
                                                        {item.platform}
                                                    </CardTitle>
                                                    <p className="text-xs text-muted-foreground truncate mt-1">
                                                        {item.url.replace(/^https?:\/\//, "")}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    <Pencil className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => setDeleteId(item.id)}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
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
                            Esta acción no se puede deshacer. Se eliminará permanentemente este enlace.
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
