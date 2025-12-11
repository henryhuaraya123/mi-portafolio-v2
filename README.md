# Portafolio Dinámico - Next.js + Supabase

Portafolio profesional construido con Next.js 14, TypeScript, Tailwind CSS, shadcn/ui y Supabase.

## 🚀 Características

- ✨ Diseño moderno y minimalista con shadcn/ui
- 🌓 Modo oscuro/claro con next-themes
- 📱 Totalmente responsive
- 🎨 Animaciones suaves con Framer Motion
- 🔐 Panel de administración protegido
- 📝 CRUD completo para gestionar contenido
- 📄 Subida de certificados PDF
- 🖼️ Gestión de imágenes de proyectos
- 📧 Formulario de contacto funcional
- ⚡ Server-side rendering con Next.js App Router

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
cd portafolio-dos
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Copia `.env.example` a `.env.local` y configura tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

4. **Configurar Supabase**

Ejecuta el script SQL en `database-schema.sql` en tu proyecto de Supabase para crear todas las tablas necesarias.

5. **Crear bucket de Storage**

En Supabase Storage, crea un bucket público llamado `portafolio-assets` con las siguientes carpetas:
- `certificates/` - Para certificados PDF
- `projects/` - Para imágenes de proyectos
- `cv/` - Para archivos CV
- `hero/` - Para imágenes de fondo del hero

6. **Crear usuario administrador**

En Supabase Authentication, crea un usuario con email y contraseña para acceder al panel de administración.

## 🚀 Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── (public)/          # Rutas públicas
│   │   └── page.tsx       # Homepage
│   ├── admin/             # Panel de administración
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── education/
│   │   ├── experience/
│   │   ├── projects/
│   │   ├── contact-links/
│   │   └── config/
│   ├── login/             # Página de login
│   ├── api/               # API Routes
│   │   ├── contact/
│   │   └── upload/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                # Componentes shadcn/ui
│   ├── layout/            # Navbar, Footer
│   ├── sections/          # Secciones del Portafolio
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── lib/
│   └── supabase/          # Clientes de Supabase
│       ├── client.ts
│       └── server.ts
├── types/
│   └── database.types.ts  # Tipos TypeScript
└── middleware.ts          # Protección de rutas
```

## 🎨 Componentes Principales

### Secciones Públicas
- **HeroSection**: Sección principal con CTA
- **AboutSection**: Información personal
- **ProjectsSection**: Grid de proyectos
- **EducationSection**: Timeline de educación con certificados
- **ExperienceSection**: Timeline de experiencia laboral
- **ContactSection**: Formulario de contacto

### Panel de Administración
- Dashboard principal con acceso a todas las secciones
- CRUD completo para:
  - Proyectos (con imágenes)
  - Educación (con certificados PDF)
  - Experiencia
  - Enlaces de contacto
  - Configuración global

## 🔐 Autenticación

El proyecto usa Supabase Auth para proteger las rutas del admin:
- `/login` - Página de inicio de sesión
- `/admin/*` - Rutas protegidas (requieren autenticación)

El middleware (`src/middleware.ts`) maneja la protección de rutas automáticamente.

## 📤 Subida de Archivos

### Certificados PDF
Los certificados se suben a través de la API `/api/upload`:
- Solo acepta archivos PDF
- Se almacenan en `portafolio-assets/certificates/`
- La URL se guarda en la columna `certificate_url`

### Imágenes de Proyectos
Similar al proceso de certificados, pero acepta imágenes (JPG, PNG, WebP).

## 🎯 Uso del Panel de Administración

1. Accede a `/login` con tus credenciales
2. Serás redirigido al dashboard `/admin`
3. Selecciona la sección que deseas administrar
4. Usa los botones para:
   - ➕ Crear nuevos registros
   - ✏️ Editar registros existentes
   - 🗑️ Eliminar registros

## 🌐 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Despliega

### Otras plataformas

El proyecto es compatible con cualquier plataforma que soporte Next.js 14+.

## 📝 Licencia

MIT

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría hacer.

## 📧 Contacto

Para preguntas o soporte, contacta a través del formulario en el Portafolio.
