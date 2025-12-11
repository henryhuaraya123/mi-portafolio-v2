import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { HeroSection } from "@/components/sections/HeroSection"
import { AboutSection } from "@/components/sections/AboutSection"
import { ProjectsSection } from "@/components/sections/ProjectsSection"
import { EducationSection } from "@/components/sections/EducationSection"
import { ExperienceSection } from "@/components/sections/ExperienceSection"
import { ContactSection } from "@/components/sections/ContactSection"

export const revalidate = 60 // Revalidate every 60 seconds

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch all data in parallel
  const [
    { data: globalConfig },
    { data: projects },
    { data: projectImages },
    { data: education },
    { data: experience },
    { data: contactLinks },
  ] = await Promise.all([
    supabase.from("global_config").select("*").single(),
    supabase.from("projects").select("*").order("display_order"),
    supabase.from("project_images").select("*").order("display_order"),
    supabase.from("education").select("*").order("display_order"),
    supabase.from("experience").select("*").order("display_order"),
    supabase.from("contact_links").select("*").order("display_order"),
  ])

  // Combine projects with their images
  const projectsWithImages = projects?.map((project) => ({
    ...project,
    project_images: projectImages?.filter((img) => img.project_id === project.id) || [],
  })) || []

  return (
    <>
      <Navbar />
      <main>
        <HeroSection
          role={globalConfig?.role}
          headline={globalConfig?.headline}
          cvUrl={globalConfig?.cv_url}
          heroBgUrl={globalConfig?.hero_bg_url}
        />
        <AboutSection
          content={globalConfig?.about_me_content}
          avatarUrl={globalConfig?.avatar_url}
        />
        <ProjectsSection projects={projectsWithImages} />
        <EducationSection education={education || []} />
        <ExperienceSection experience={experience || []} />
        <ContactSection contactLinks={contactLinks || []} />
      </main>
      <Footer contactLinks={contactLinks || []} />
    </>
  )
}
