import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

// Helper function to clean data - convert empty strings to null
function cleanData(data: any) {
    const cleaned: any = {}
    for (const [key, value] of Object.entries(data)) {
        // Convert empty strings to null for optional fields
        cleaned[key] = value === "" ? null : value
    }
    return cleaned
}

// GET - Fetch all experience entries
export async function GET() {
    try {
        const supabase = createAdminClient()

        const { data, error } = await supabase
            .from("experience")
            .select("*")
            .order("start_date", { ascending: false })

        if (error) {
            console.error("Error fetching experience:", error)
            return NextResponse.json(
                { error: "Error al cargar experiencia" },
                { status: 500 }
            )
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error("Error in experience GET:", error)
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}

// POST - Create new experience entry
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const cleanedData = cleanData(body)
        const supabase = createAdminClient()

        const { data, error } = await supabase
            .from("experience")
            .insert(cleanedData)
            .select()
            .single()

        if (error) {
            console.error("Error creating experience:", error)
            return NextResponse.json(
                { error: "Error al crear experiencia", details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error("Error in experience POST:", error)
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}

// PUT - Update experience entry
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, ...updateData } = body
        const cleanedData = cleanData(updateData)
        const supabase = createAdminClient()

        const { error } = await supabase
            .from("experience")
            .update(cleanedData)
            .eq("id", id)

        if (error) {
            console.error("Error updating experience:", error)
            return NextResponse.json(
                { error: "Error al actualizar experiencia", details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error in experience PUT:", error)
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}

// DELETE - Delete experience entry
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json(
                { error: "ID no proporcionado" },
                { status: 400 }
            )
        }

        const supabase = createAdminClient()

        const { error } = await supabase
            .from("experience")
            .delete()
            .eq("id", parseInt(id))

        if (error) {
            console.error("Error deleting experience:", error)
            return NextResponse.json(
                { error: "Error al eliminar experiencia", details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error in experience DELETE:", error)
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}
