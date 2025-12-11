"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Upload, FileText, Image as ImageIcon, Save } from "lucide-react"
import { toast } from "sonner"
import type { GlobalConfig } from "@/types/database.types"
import Link from "next/link"
import Image from "next/image"

export default function ConfigAdminPage() {
    const [config, setConfig] = useState<GlobalConfig | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isUploadingCV, setIsUploadingCV] = useState(false)
    const [isUploadingHero, setIsUploadingHero] = useState(false)
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
    const router = useRouter()

    const [formData, setFormData] = useState({
        role: "",
        headline: "",
        about_me_content: "",
        cv_url: "",
        hero_bg_url: "",
        avatar_url: "",
    })

    useEffect(() => {
        fetchConfig()
    }, [])

    const fetchConfig = async () => {
        try {
            const response = await fetch("/api/global-config")
            if (!response.ok) {
                if (response.status === 404 || response.status === 500) {
                    toast.info("Creando configuración inicial...")
                } else {
                    throw new Error("Error al cargar configuración")
                }
            } else {
                const data = await response.json()
                setConfig(data)
                setFormData({
                    role: data.role || "",
                    headline: data.headline || "",
                    about_me_content: data.about_me_content || "",
                    cv_url: data.cv_url || "",
                    hero_bg_url: data.hero_bg_url || "",
                    avatar_url: data.avatar_url || "",
                })
            }
        } catch (error) {
            toast.error("Error al cargar configuración")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.type !== "application/pdf") {
            toast.error("Solo se permiten archivos PDF")
            return
        }

        setIsUploadingCV(true)
        const uploadFormData = new FormData()
        uploadFormData.append("file", file)
        uploadFormData.append("folder", "cv")

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: uploadFormData,
            })

            if (response.ok) {
                const { url } = await response.json()
                setFormData((prev) => ({ ...prev, cv_url: url }))
                toast.success("CV subido correctamente")
            } else {
                throw new Error("Error al subir CV")
            }
        } catch (error) {
            toast.error("Error al subir el CV")
        } finally {
            setIsUploadingCV(false)
        }
    }

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith("image/")) {
            toast.error("Solo se permiten imágenes")
            return
        }

        setIsUploadingAvatar(true)
        const uploadFormData = new FormData()
        uploadFormData.append("file", file)
        uploadFormData.append("folder", "avatar")

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: uploadFormData,
            })

            if (response.ok) {
                const { url } = await response.json()
                setFormData((prev) => ({ ...prev, avatar_url: url }))
                toast.success("Avatar subido correctamente")
            } else {
                throw new Error("Error al subir avatar")
            }
        } catch (error) {
            toast.error("Error al subir el avatar")
        } finally {
            setIsUploadingAvatar(false)
        }
    }

    const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const isImage = file.type.startsWith("image/")
        const isVideo = file.type.startsWith("video/")

        if (!isImage && !isVideo) {
            toast.error("Solo se permiten imágenes o videos")
            return
        }

        setIsUploadingHero(true)
        const uploadFormData = new FormData()
        uploadFormData.append("file", file)
        uploadFormData.append("folder", "hero")

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: uploadFormData,
            })

            if (response.ok) {
                const { url } = await response.json()
                setFormData((prev) => ({ ...prev, hero_bg_url: url }))
                toast.success("Imagen de fondo subida correctamente")
            } else {
                throw new Error("Error al subir imagen")
            }
        } catch (error) {
            toast.error("Error al subir la imagen")
        } finally {
            setIsUploadingHero(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await fetch("/api/global-config", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: config?.id || 1,
                    ...formData,
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.details || "Error al guardar")
            }

            toast.success("Configuración guardada correctamente")
            fetchConfig()
            router.refresh()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error al guardar la configuración")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
                <p>Cargando configuración...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted">
            <header className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/admin">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <h1 className="text-2xl font-heading font-bold">Configuración Global</h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle>Configuración del Portafolio</CardTitle>
                        <CardDescription>
                            Actualiza la información general de tu Portafolio
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Role */}
                            <div>
                                <Label htmlFor="role">Rol/Título Profesional *</Label>
                                <Input
                                    id="role"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    placeholder="Full Stack Developer"
                                    required
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Aparece en la sección Hero
                                </p>
                            </div>

                            {/* Headline */}
                            <div>
                                <Label htmlFor="headline">Headline/Eslogan *</Label>
                                <Input
                                    id="headline"
                                    value={formData.headline}
                                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                                    placeholder="Construyendo experiencias web excepcionales"
                                    required
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Frase principal en la sección Hero
                                </p>
                            </div>

                            {/* About Me */}
                            <div>
                                <Label htmlFor="about_me_content">Sobre Mí *</Label>
                                <Textarea
                                    id="about_me_content"
                                    value={formData.about_me_content}
                                    onChange={(e) =>
                                        setFormData({ ...formData, about_me_content: e.target.value })
                                    }
                                    rows={6}
                                    placeholder="Escribe sobre ti, tu experiencia, habilidades y pasiones..."
                                    required
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Contenido de la sección "Sobre Mí"
                                </p>
                            </div>

                            {/* Avatar Upload */}
                            <div>
                                <Label htmlFor="avatar">Foto de Perfil (Avatar)</Label>
                                <div className="space-y-2">
                                    <Input
                                        id="avatar"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarUpload}
                                        disabled={isUploadingAvatar}
                                    />
                                    {isUploadingAvatar && (
                                        <p className="text-sm text-muted-foreground">Subiendo foto...</p>
                                    )}
                                    {formData.avatar_url && (
                                        <div className="space-y-2">
                                            <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-border">
                                                <Image
                                                    src={formData.avatar_url}
                                                    alt="Avatar preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <a
                                                href={formData.avatar_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-green-600 underline flex items-center gap-2"
                                            >
                                                <ImageIcon className="h-4 w-4" />
                                                Ver foto actual
                                            </a>
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Se mostrará en la sección "Sobre Mí"
                                </p>
                            </div>

                            {/* CV Upload */}
                            <div>
                                <Label htmlFor="cv">Curriculum Vitae (PDF)</Label>
                                <div className="space-y-2">
                                    <Input
                                        id="cv"
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleCVUpload}
                                        disabled={isUploadingCV}
                                    />
                                    {isUploadingCV && (
                                        <p className="text-sm text-muted-foreground">Subiendo CV...</p>
                                    )}
                                    {formData.cv_url && (
                                        <div className="flex items-center gap-2 text-sm text-green-600">
                                            <FileText className="h-4 w-4" />
                                            <a
                                                href={formData.cv_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="underline"
                                            >
                                                Ver CV actual
                                            </a>
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Botón de descarga en la sección Hero
                                </p>
                            </div>

                            {/* Hero Background */}
                            <div>
                                <Label htmlFor="hero_bg">Imagen de Fondo del Hero</Label>
                                <div className="space-y-2">
                                    <Input
                                        id="hero_bg"
                                        type="file"
                                        accept="image/*,video/*"
                                        onChange={handleHeroImageUpload}
                                        disabled={isUploadingHero}
                                    />
                                    {isUploadingHero && (
                                        <p className="text-sm text-muted-foreground">Subiendo imagen...</p>
                                    )}
                                    {formData.hero_bg_url && (
                                        <div className="space-y-2">
                                            <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-border max-w-md">
                                                {formData.hero_bg_url.match(/\.(mp4|webm|ogg)$/i) ? (
                                                    <video
                                                        src={formData.hero_bg_url}
                                                        className="w-full h-full object-cover"
                                                        controls
                                                    />
                                                ) : (
                                                    <Image
                                                        src={formData.hero_bg_url}
                                                        alt="Hero background preview"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                )}
                                            </div>
                                            <a
                                                href={formData.hero_bg_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-green-600 underline flex items-center gap-2"
                                            >
                                                <ImageIcon className="h-4 w-4" />
                                                Ver imagen actual
                                            </a>
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Imagen de fondo de la sección Hero (opcional)
                                </p>
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-2 justify-end pt-4 border-t">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600"
                                >
                                    {isSubmitting ? (
                                        "Guardando..."
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Guardar Configuración
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
