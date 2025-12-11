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

// GET - Fetch all education entries
export async function GET() {
    try {
        const supabase = createAdminClient()

        const { data, error } = await supabase
            .from("education")
            .select("*")
            .order("start_date", { ascending: false })

        if (error) {
            console.error("Error fetching education:", error)
            return NextResponse.json(
                { error: "Error al cargar educación" },
                { status: 500 }
            )
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error("Error in education GET:", error)
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}

// POST - Create new education entry
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const cleanedData = cleanData(body)
        const supabase = createAdminClient()

        const { data, error } = await supabase
            .from("education")
            .insert(cleanedData)
            .select()
            .single()

        if (error) {
            console.error("Error creating education:", error)
            return NextResponse.json(
                { error: "Error al crear educación", details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error("Error in education POST:", error)
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}

// PUT - Update education entry
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, ...updateData } = body
        const cleanedData = cleanData(updateData)
        const supabase = createAdminClient()

        const { error } = await supabase
            .from("education")
            .update(cleanedData)
            .eq("id", id)

        if (error) {
            console.error("Error updating education:", error)
            return NextResponse.json(
                { error: "Error al actualizar educación", details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error in education PUT:", error)
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}

// DELETE - Delete education entry
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
            .from("education")
            .delete()
            .eq("id", parseInt(id))

        if (error) {
            console.error("Error deleting education:", error)
            return NextResponse.json(
                { error: "Error al eliminar educación", details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error in education DELETE:", error)
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}
