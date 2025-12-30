"use client"

import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Github, Linkedin, Mail, Twitter } from "lucide-react"

interface FooterProps {
    contactLinks?: Array<{
        platform: string
        url: string
        icon_name: string
    }>
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    mail: Mail,
}

export function Footer({ contactLinks = [] }: FooterProps) {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t border-border bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-lg font-heading font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">
                            Henry Denilson H.
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Henry Denilson Huaraya Chipana | Desarrollador Full Stack apasionado por crear experiencias web excepcionales.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-semibold mb-4">Enlaces Rápidos</h4>
                        <ul className="space-y-2">
                            <li>
                                <button
                                    onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Sobre Mí
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" })}
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Proyectos
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Contacto
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h4 className="text-sm font-semibold mb-4">Redes Sociales</h4>
                        <div className="flex space-x-4">
                            {contactLinks.map((link) => {
                                const Icon = iconMap[link.icon_name.toLowerCase()] || Mail
                                return (
                                    <Link
                                        key={link.platform}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span className="sr-only">{link.platform}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <Separator className="my-8" />

                <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
                    <p>© {currentYear} Henry Denilson Huaraya Chipana. Todos los derechos reservados.</p>
                    <p className="mt-2 sm:mt-0">
                        Hecho con agentes LLM + conocimientos personales con las tecnologías Next.js y Supabase
                    </p>
                </div>
            </div>
        </footer>
    )
}
