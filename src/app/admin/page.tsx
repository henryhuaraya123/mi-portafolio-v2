"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import {
    LayoutDashboard,
    FolderKanban,
    GraduationCap,
    Briefcase,
    Link as LinkIcon,
    Settings,
    LogOut,
    Home,
    Mail
} from "lucide-react"
import Link from "next/link"

const adminSections = [
    {
        title: "Proyectos",
        description: "Gestiona tus proyectos y portafolio",
        icon: FolderKanban,
        href: "/admin/projects",
        color: "from-blue-500 to-cyan-500",
    },
    {
        title: "Educación",
        description: "Administra tu formación académica",
        icon: GraduationCap,
        href: "/admin/education",
        color: "from-green-500 to-emerald-500",
    },
    {
        title: "Experiencia",
        description: "Gestiona tu experiencia laboral",
        icon: Briefcase,
        href: "/admin/experience",
        color: "from-purple-500 to-pink-500",
    },
    {
        title: "Enlaces de Contacto",
        description: "Administra tus redes sociales",
        icon: LinkIcon,
        href: "/admin/contact-links",
        color: "from-orange-500 to-red-500",
    },
    {
        title: "Mensajes",
        description: "Ver mensajes de contacto recibidos",
        icon: Mail,
        href: "/admin/messages",
        color: "from-indigo-500 to-blue-500",
    },
    {
        title: "Configuración Global",
        description: "Ajustes generales del Portafolio",
        icon: Settings,
        href: "/admin/config",
        color: "from-gray-500 to-slate-500",
    },
]

export default function AdminDashboard() {
    const router = useRouter()

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        toast.success("Sesión cerrada correctamente")
        router.push("/login")
        router.refresh()
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted">
            {/* Header */}
            <header className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <LayoutDashboard className="h-6 w-6 text-primary" />
                            <h1 className="text-2xl font-heading font-bold">Panel de Administración</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" asChild>
                                <Link href="/">
                                    <Home className="mr-2 h-4 w-4" />
                                    Ver Portafolio
                                </Link>
                            </Button>
                            <Button variant="destructive" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Cerrar Sesión
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h2 className="text-3xl font-heading font-bold mb-2">
                        Bienvenido al Dashboard
                    </h2>
                    <p className="text-muted-foreground">
                        Gestiona todo el contenido de tu Portafolio desde aquí
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {adminSections.map((section) => {
                        const Icon = section.icon
                        return (
                            <Link key={section.href} href={section.href}>
                                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                                    <CardHeader>
                                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${section.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                            <Icon className="h-6 w-6 text-white" />
                                        </div>
                                        <CardTitle className="font-heading">{section.title}</CardTitle>
                                        <CardDescription>{section.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button variant="ghost" className="w-full">
                                            Administrar →
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            </main>
        </div>
    )
}
