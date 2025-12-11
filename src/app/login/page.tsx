"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { LogIn } from "lucide-react"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                toast.error("Error de autenticación", {
                    description: error.message,
                })
            } else {
                toast.success("¡Bienvenido!", {
                    description: "Inicio de sesión exitoso",
                })
                router.push("/admin")
                router.refresh()
            }
        } catch (error) {
            toast.error("Error", {
                description: "Ocurrió un error inesperado",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-heading text-center">
                        Panel de Administración
                    </CardTitle>
                    <CardDescription className="text-center">
                        Ingresa tus credenciales para acceder
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                "Iniciando sesión..."
                            ) : (
                                <>
                                    <LogIn className="mr-2 h-4 w-4" />
                                    Iniciar Sesión
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
