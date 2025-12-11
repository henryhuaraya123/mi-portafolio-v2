import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

// GET - Fetch global configuration
export async function GET() {
    try {
        const supabase = createAdminClient()

        const { data, error } = await supabase
            .from("global_config")
            .select("*")
            .single()

        if (error) {
            console.error("Error fetching global config:", error)
            return NextResponse.json(
                { error: "Error al cargar configuración global" },
                { status: 500 }
            )
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error("Error in global config GET:", error)
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}

// PUT - Update global configuration
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, ...updateData } = body
        const supabase = createAdminClient()

        const { error } = await supabase
            .from("global_config")
            .update(updateData)
            .eq("id", id)

        if (error) {
            console.error("Error updating global config:", error)
            return NextResponse.json(
                { error: "Error al actualizar configuración global", details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error in global config PUT:", error)
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}
