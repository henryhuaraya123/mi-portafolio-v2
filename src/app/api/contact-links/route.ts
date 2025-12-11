import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

// GET - Fetch all contact links
export async function GET() {
    try {
        const supabase = createAdminClient()

        const { data, error } = await supabase
            .from("contact_links")
            .select("*")
            .order("display_order")

        if (error) {
            console.error("Error fetching contact links:", error)
            return NextResponse.json(
                { error: "Error al cargar enlaces de contacto" },
                { status: 500 }
            )
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error("Error in contact links GET:", error)
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}

// POST - Create new contact link
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const supabase = createAdminClient()

        const { data, error } = await supabase
            .from("contact_links")
            .insert(body)
            .select()
            .single()

        if (error) {
            console.error("Error creating contact link:", error)
            return NextResponse.json(
                { error: "Error al crear enlace de contacto", details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error("Error in contact links POST:", error)
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}

// PUT - Update contact link
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, ...updateData } = body
        const supabase = createAdminClient()

        const { error } = await supabase
            .from("contact_links")
            .update(updateData)
            .eq("id", id)

        if (error) {
            console.error("Error updating contact link:", error)
            return NextResponse.json(
                { error: "Error al actualizar enlace de contacto", details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error in contact links PUT:", error)
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}

// DELETE - Delete contact link
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
            .from("contact_links")
            .delete()
            .eq("id", parseInt(id))

        if (error) {
            console.error("Error deleting contact link:", error)
            return NextResponse.json(
                { error: "Error al eliminar enlace de contacto", details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error in contact links DELETE:", error)
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}
