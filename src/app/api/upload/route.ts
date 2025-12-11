import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
    try {
        console.log("📤 Upload API called")

        const formData = await request.formData()
        const file = formData.get("file") as File
        const folder = formData.get("folder") as string || "certificates"

        console.log("📁 File info:", {
            name: file?.name,
            type: file?.type,
            size: file?.size,
            folder
        })

        if (!file) {
            console.error("❌ No file provided")
            return NextResponse.json(
                { error: "No se proporcionó ningún archivo" },
                { status: 400 }
            )
        }

        // Validate file type for certificates
        if (folder === "certificates" && file.type !== "application/pdf") {
            console.error("❌ Invalid file type for certificates:", file.type)
            return NextResponse.json(
                { error: "Solo se permiten archivos PDF para certificados" },
                { status: 400 }
            )
        }

        console.log("🔐 Creating Supabase admin client...")
        const supabase = createAdminClient()

        // Check if client was created successfully
        if (!supabase) {
            console.error("❌ Failed to create Supabase admin client")
            return NextResponse.json(
                { error: "Error de configuración del servidor" },
                { status: 500 }
            )
        }

        // Generate unique filename
        const fileExt = file.name.split(".").pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `${folder}/${fileName}`

        console.log("📝 Generated file path:", filePath)

        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        console.log("📦 Buffer size:", buffer.length, "bytes")

        // Upload to Supabase Storage
        console.log("☁️ Uploading to Supabase Storage...")
        const { data, error } = await supabase.storage
            .from("portafolio-assets")
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: false,
            })

        if (error) {
            console.error("❌ Supabase storage error:", {
                message: error.message,
                error: error
            })
            return NextResponse.json(
                {
                    error: "Error al subir el archivo",
                    details: error.message
                },
                { status: 500 }
            )
        }

        console.log("✅ File uploaded successfully:", data.path)

        // Get public URL
        const {
            data: { publicUrl },
        } = supabase.storage.from("portafolio-assets").getPublicUrl(data.path)

        console.log("🔗 Public URL generated:", publicUrl)

        return NextResponse.json({ url: publicUrl }, { status: 200 })
    } catch (error) {
        console.error("❌ Error in upload API:", error)
        return NextResponse.json(
            {
                error: "Error interno del servidor",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        )
    }
}
