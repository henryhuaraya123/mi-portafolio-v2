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

// GET - Fetch all projects with images
export async function GET() {
    try {
        const supabase = createAdminClient()

        const { data: projectsData, error: projectsError } = await supabase
            .from("projects")
            .select("*")
            .order("display_order")

        if (projectsError) {
            console.error("Error fetching projects:", projectsError)
            return NextResponse.json(
                { error: "Error al cargar proyectos" },
                { status: 500 }
            )
        }

        const { data: imagesData } = await supabase
            .from("project_images")
            .select("*")
            .order("display_order")

        const projectsWithImages = projectsData?.map((project) => ({
            ...project,
            project_images: imagesData?.filter((img) => img.project_id === project.id) || [],
        })) || []

        return NextResponse.json(projectsWithImages)
    } catch (error) {
        console.error("Error in projects GET:", error)
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}

// POST - Create new project
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { projectData, images } = body
        const cleanedProjectData = cleanData(projectData)

        const supabase = createAdminClient()

        // Insert project
        const { data: project, error: projectError } = await supabase
            .from("projects")
            .insert(cleanedProjectData)
            .select()
            .single()

        if (projectError) {
            console.error("Error creating project:", projectError)
            return NextResponse.json(
                { error: "Error al crear el proyecto", details: projectError.message },
                { status: 500 }
            )
        }

        // Insert images if provided
        if (images && images.length > 0) {
            const imageInserts = images.map((img: any, index: number) => ({
                project_id: project.id,
                image_url: img.url,
                is_main: img.isMain,
                display_order: index,
            }))

            const { error: imageError } = await supabase
                .from("project_images")
                .insert(imageInserts)

            if (imageError) {
                console.error("Error inserting images:", imageError)
                // Don't fail the whole operation, just log the error
            }
        }

        return NextResponse.json(project)
    } catch (error) {
        console.error("Error in projects POST:", error)
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}

// PUT - Update project
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, projectData, images } = body
        const cleanedProjectData = cleanData(projectData)

        const supabase = createAdminClient()

        // Update project
        const { error: projectError } = await supabase
            .from("projects")
            .update(cleanedProjectData)
            .eq("id", id)

        if (projectError) {
            console.error("Error updating project:", projectError)
            return NextResponse.json(
                { error: "Error al actualizar el proyecto", details: projectError.message },
                { status: 500 }
            )
        }

        // Update images if provided
        if (images && images.length > 0) {
            // Delete old images
            await supabase.from("project_images").delete().eq("project_id", id)

            // Insert new images
            const imageInserts = images.map((img: any, index: number) => ({
                project_id: id,
                image_url: img.url,
                is_main: img.isMain,
                display_order: index,
            }))

            const { error: imageError } = await supabase
                .from("project_images")
                .insert(imageInserts)

            if (imageError) {
                console.error("Error inserting images:", imageError)
            }
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error in projects PUT:", error)
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}

// DELETE - Delete project
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
            .from("projects")
            .delete()
            .eq("id", parseInt(id))

        if (error) {
            console.error("Error deleting project:", error)
            return NextResponse.json(
                { error: "Error al eliminar el proyecto", details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error in projects DELETE:", error)
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}
