"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ArrowLeft, Mail, Trash2, Eye, Calendar, User } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import type { ContactMessage } from "@/types/database.types"
import Link from "next/link"

export default function MessagesAdminPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const router = useRouter()

    useEffect(() => {
        fetchMessages()
    }, [])

    const fetchMessages = async () => {
        const supabase = createClient()
        const { data, error } = await supabase
            .from("contact_messages")
            .select("*")
            .order("created_at", { ascending: false })

        if (error) {
            toast.error("Error al cargar mensajes")
        } else {
            setMessages(data || [])
        }
        setIsLoading(false)
    }

    const handleViewMessage = async (message: ContactMessage) => {
        setSelectedMessage(message)

        // Mark as read if not already
        if (!message.read) {
            const supabase = createClient()
            await supabase
                .from("contact_messages")
                .update({ read: true })
                .eq("id", message.id)

            // Update local state
            setMessages(
                messages.map((m) => (m.id === message.id ? { ...m, read: true } : m))
            )
            router.refresh()
        }
    }

    const handleDelete = async () => {
        if (!deleteId) return

        const supabase = createClient()
        const { error } = await supabase
            .from("contact_messages")
            .delete()
            .eq("id", deleteId)

        if (error) {
            toast.error("Error al eliminar mensaje")
        } else {
            toast.success("Mensaje eliminado correctamente")
            setMessages(messages.filter((m) => m.id !== deleteId))
            router.refresh()
        }
        setDeleteId(null)
    }

    const toggleRead = async (message: ContactMessage) => {
        const supabase = createClient()
        const { error } = await supabase
            .from("contact_messages")
            .update({ read: !message.read })
            .eq("id", message.id)

        if (error) {
            toast.error("Error al actualizar mensaje")
        } else {
            setMessages(
                messages.map((m) =>
                    m.id === message.id ? { ...m, read: !m.read } : m
                )
            )
            toast.success(message.read ? "Marcado como no leído" : "Marcado como leído")
            router.refresh()
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const unreadCount = messages.filter((m) => !m.read).length

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
                            <div>
                                <h1 className="text-2xl font-heading font-bold">Mensajes de Contacto</h1>
                                {unreadCount > 0 && (
                                    <p className="text-sm text-muted-foreground">
                                        {unreadCount} mensaje{unreadCount !== 1 ? "s" : ""} sin leer
                                    </p>
                                )}
                            </div>
                        </div>
                        {unreadCount > 0 && (
                            <Badge variant="destructive" className="text-sm">
                                {unreadCount} nuevos
                            </Badge>
                        )}
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {isLoading ? (
                    <div className="text-center py-12">Cargando mensajes...</div>
                ) : messages.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-muted-foreground">
                            <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No hay mensajes de contacto.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4 max-w-4xl mx-auto">
                        {messages.map((message) => (
                            <Card
                                key={message.id}
                                className={`cursor-pointer transition-all hover:shadow-md ${!message.read ? "border-primary/50 bg-primary/5" : ""
                                    }`}
                                onClick={() => handleViewMessage(message)}
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CardTitle className="font-heading text-lg flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    {message.name}
                                                </CardTitle>
                                                {!message.read && (
                                                    <Badge variant="default" className="text-xs">
                                                        Nuevo
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Mail className="h-3 w-3" />
                                                    {message.email}
                                                </span>
                                                <span className="hidden sm:inline">•</span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(message.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    toggleRead(message)
                                                }}
                                                title={message.read ? "Marcar como no leído" : "Marcar como leído"}
                                            >
                                                <Eye className={`h-4 w-4 ${message.read ? "opacity-50" : ""}`} />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setDeleteId(message.id)
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {message.message}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            {/* Message Detail Dialog */}
            <Dialog open={selectedMessage !== null} onOpenChange={() => setSelectedMessage(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            {selectedMessage?.name}
                        </DialogTitle>
                        <DialogDescription className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <a
                                    href={`mailto:${selectedMessage?.email}`}
                                    className="text-primary hover:underline"
                                >
                                    {selectedMessage?.email}
                                </a>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {selectedMessage && formatDate(selectedMessage.created_at)}
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                        <h4 className="font-semibold mb-2">Mensaje:</h4>
                        <div className="bg-muted p-4 rounded-lg">
                            <p className="text-sm whitespace-pre-line">{selectedMessage?.message}</p>
                        </div>
                    </div>
                    <div className="flex gap-2 justify-end mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setSelectedMessage(null)}
                        >
                            Cerrar
                        </Button>
                        <Button
                            variant="default"
                            asChild
                        >
                            <a href={`mailto:${selectedMessage?.email}`}>
                                <Mail className="mr-2 h-4 w-4" />
                                Responder
                            </a>
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente este mensaje.
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
