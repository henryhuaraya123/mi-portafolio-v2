import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, message } = body

        // Validate input
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Todos los campos son requeridos" },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // Insert contact message
        const { error } = await supabase.from("contact_messages").insert({
            name,
            email,
            message,
            read: false,
        })

        if (error) {
            console.error("Error inserting contact message:", error)
            return NextResponse.json(
                { error: "Error al guardar el mensaje" },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        console.error("Error in contact API:", error)
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}
