"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Send, Github, Linkedin, Twitter } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import type { ContactLink } from "@/types/database.types"

const contactFormSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
})

type ContactFormData = z.infer<typeof contactFormSchema>

interface ContactSectionProps {
    contactLinks?: ContactLink[]
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    mail: Mail,
}

export function ContactSection({ contactLinks = [] }: ContactSectionProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactFormSchema),
    })

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true)
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                toast.success("¡Mensaje enviado!", {
                    description: "Gracias por contactarme. Te responderé pronto.",
                })
                reset()
            } else {
                throw new Error("Error al enviar el mensaje")
            }
        } catch (error) {
            toast.error("Error", {
                description: "No se pudo enviar el mensaje. Inténtalo de nuevo.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section id="contact" className="py-20 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl sm:text-4xl font-heading font-bold text-center mb-4">
                        <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Contacto</span>
                    </h2>
                    <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                        ¿Tienes un proyecto en mente? ¡Hablemos!
                    </p>

                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Contact Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="h-5 w-5" />
                                    Envíame un mensaje
                                </CardTitle>
                                <CardDescription>
                                    Completa el formulario y me pondré en contacto contigo
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Nombre</Label>
                                        <Input
                                            id="name"
                                            placeholder="Tu nombre"
                                            {...register("name")}
                                            className={errors.name ? "border-destructive" : ""}
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-destructive mt-1">
                                                {errors.name.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="tu@email.com"
                                            {...register("email")}
                                            className={errors.email ? "border-destructive" : ""}
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-destructive mt-1">
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="message">Mensaje</Label>
                                        <Textarea
                                            id="message"
                                            placeholder="Tu mensaje..."
                                            rows={5}
                                            {...register("message")}
                                            className={errors.message ? "border-destructive" : ""}
                                        />
                                        {errors.message && (
                                            <p className="text-sm text-destructive mt-1">
                                                {errors.message.message}
                                            </p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            "Enviando..."
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-4 w-4" />
                                                Enviar Mensaje
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Contact Info */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Conéctate conmigo</CardTitle>
                                    <CardDescription>
                                        También puedes encontrarme en estas plataformas
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* WhatsApp Directo */}
                                    <Link
                                        href="https://wa.me/51916552652?text=Hola,%20necesito%20contactarte"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 transition-all group"
                                    >
                                        <div className="p-2 rounded-full bg-green-500 text-white shadow-md group-hover:scale-110 transition-transform">
                                            {/* Icono de WhatsApp - SVG Inline para evitar dependencias */}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="h-5 w-5"
                                            >
                                                <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                                                <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0 1 0v3a.5.5 0 0 1-1 0v-1a.5.5 0 0 1-1 0V10z" />
                                                <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" style={{ display: 'none' }} />
                                                {/* Usando path de Phone para simular, o MessageCircle. Mejor usar el SVG real simplificado */}
                                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-bold text-green-600 dark:text-green-400">WhatsApp</p>
                                            <p className="text-sm text-foreground/80">
                                                Envíame un mensaje directo
                                            </p>
                                        </div>
                                    </Link>

                                    {contactLinks.map((link) => {
                                        const Icon = iconMap[link.icon_name.toLowerCase()] || Mail
                                        return (
                                            <Link
                                                key={link.id}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors group"
                                            >
                                                <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                                    <Icon className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{link.platform}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {link.url.replace(/^https?:\/\//, "")}
                                                    </p>
                                                </div>
                                            </Link>
                                        )
                                    })}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
