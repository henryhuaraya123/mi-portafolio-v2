# 📘 Guía de Implementación - Portafolio Dinámico

## 🎯 Resumen del Proyecto

Este proyecto es un **Portafolio dinámico profesional** construido con:
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI**: shadcn/ui con diseño minimalista y premium
- **Backend**: Supabase (Base de datos, Storage, Authentication)
- **Fuentes**: Space Grotesk (sans) y Orbitron (heading)
- **Animaciones**: Framer Motion
- **Validación**: React Hook Form + Zod
- **Notificaciones**: Sonner

## 📦 Estructura Completa del Proyecto

```
portafolio-dos/
├── src/
│   ├── app/
│   │   ├── admin/                    # Panel de administración
│   │   │   ├── layout.tsx           # Layout con protección de auth
│   │   │   ├── page.tsx             # Dashboard principal
│   │   │   ├── education/           # CRUD de Educación
│   │   │   │   └── page.tsx
│   │   │   ├── experience/          # CRUD de Experiencia (por implementar)
│   │   │   ├── projects/            # CRUD de Proyectos (por implementar)
│   │   │   ├── contact-links/       # CRUD de Enlaces (por implementar)
│   │   │   └── config/              # Configuración Global (por implementar)
│   │   ├── api/
│   │   │   ├── contact/
│   │   │   │   └── route.ts         # API para formulario de contacto
│   │   │   └── upload/
│   │   │       └── route.ts         # API para subir archivos
│   │   ├── login/
│   │   │   └── page.tsx             # Página de login
│   │   ├── layout.tsx               # Layout raíz con fuentes y providers
│   │   ├── page.tsx                 # Homepage pública
│   │   └── globals.css              # Estilos globales
│   ├── components/
│   │   ├── ui/                      # Componentes shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── label.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── select.tsx
│   │   │   ├── form.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── dropdown-menu.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx           # Navbar responsive
│   │   │   └── Footer.tsx           # Footer
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx      # Sección Hero
│   │   │   ├── AboutSection.tsx     # Sección Sobre Mí
│   │   │   ├── ProjectsSection.tsx  # Sección Proyectos
│   │   │   ├── EducationSection.tsx # Sección Educación
│   │   │   ├── ExperienceSection.tsx# Sección Experiencia
│   │   │   └── ContactSection.tsx   # Sección Contacto
│   │   ├── theme-provider.tsx       # Provider de tema
│   │   └── theme-toggle.tsx         # Toggle dark/light
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts            # Cliente de Supabase (browser)
│   │   │   └── server.ts            # Cliente de Supabase (server)
│   │   └── utils.ts                 # Utilidades (shadcn)
│   ├── types/
│   │   └── database.types.ts        # Tipos TypeScript
│   └── middleware.ts                # Middleware de autenticación
├── public/                          # Archivos estáticos
├── .env.local                       # Variables de entorno (no versionado)
├── .env.example                     # Ejemplo de variables de entorno
├── database-schema.sql              # Esquema de base de datos
├── components.json                  # Configuración de shadcn/ui
├── tailwind.config.ts               # Configuración de Tailwind
├── next.config.ts                   # Configuración de Next.js
├── tsconfig.json                    # Configuración de TypeScript
├── package.json                     # Dependencias
└── README.md                        # Documentación
```

## 🔧 Configuración Paso a Paso

### 1. Configurar Supabase

#### 1.1 Crear Proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Guarda la URL y la clave anónima

#### 1.2 Ejecutar el Esquema SQL
1. Ve a SQL Editor en Supabase
2. Copia y pega el contenido de `database-schema.sql`
3. Ejecuta el script

#### 1.3 Configurar Storage
1. Ve a Storage en Supabase
2. Crea un bucket llamado `portafolio-assets`
3. Hazlo público:
   - Configuración → Public bucket → ON
4. Las carpetas se crearán automáticamente al subir archivos

#### 1.4 Crear Usuario Admin
1. Ve a Authentication en Supabase
2. Crea un nuevo usuario con email y contraseña
3. Usa estas credenciales para acceder al panel de admin

### 2. Configurar Variables de Entorno

Crea el archivo `.env.local` con:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-aqui
```

### 3. Instalar y Ejecutar

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start
```

## 🎨 Características Implementadas

### ✅ Frontend Público

1. **Hero Section**
   - Título con gradiente animado
   - Botón de descarga de CV
   - Scroll indicator animado
   - Fondo personalizable

2. **About Section**
   - Avatar/foto de perfil
   - Contenido HTML personalizable
   - Diseño con Card de shadcn/ui

3. **Projects Section**
   - Grid responsive (1-2-3 columnas)
   - Cards con hover effects
   - Imágenes de proyectos
   - Badges de tecnologías
   - Enlaces a repo y demo

4. **Education Section**
   - Timeline vertical
   - Badges de fechas
   - **Icono de certificado** cuando existe PDF
   - Click para abrir certificado en nueva pestaña

5. **Experience Section**
   - Timeline vertical
   - Badges de fechas
   - Descripción con formato

6. **Contact Section**
   - Formulario validado con Zod
   - Toast notifications con Sonner
   - Enlaces a redes sociales
   - Guardado en Supabase

7. **Navbar**
   - Responsive con Sheet (mobile)
   - Scroll detection (backdrop blur)
   - Navegación suave entre secciones
   - Toggle de tema

8. **Footer**
   - Enlaces rápidos
   - Redes sociales
   - Copyright dinámico

### ✅ Panel de Administración

1. **Autenticación**
   - Login con Supabase Auth
   - Middleware de protección de rutas
   - Redirección automática

2. **Dashboard**
   - Cards con enlaces a cada sección CRUD
   - Botón de logout
   - Botón para ver Portafolio público

3. **CRUD de Educación** ✅
   - Listado de registros
   - Formulario de creación/edición
   - **Subida de certificados PDF**
   - Validación de archivos
   - Confirmación de eliminación
   - Toast notifications

4. **Pendientes de Implementar**
   - CRUD de Proyectos (con imágenes)
   - CRUD de Experiencia
   - CRUD de Enlaces de Contacto
   - CRUD de Configuración Global
   - Vista de mensajes de contacto

## 🔐 Seguridad

### Row Level Security (RLS)

Todas las tablas tienen RLS habilitado:

- **Lectura pública**: Cualquiera puede leer datos
- **Escritura protegida**: Solo usuarios autenticados pueden modificar
- **Mensajes de contacto**: Público puede insertar, solo admin puede leer

### Middleware

El archivo `src/middleware.ts` protege:
- Rutas `/admin/*` requieren autenticación
- Redirección automática a `/login` si no autenticado
- Redirección a `/admin` si ya autenticado e intenta acceder a `/login`

## 📤 Subida de Archivos

### Certificados PDF

**Flujo completo:**

1. Usuario selecciona PDF en el formulario
2. Se valida que sea PDF
3. Se sube a `/api/upload` con `folder: "certificates"`
4. API valida tipo de archivo
5. Se genera nombre único
6. Se sube a Supabase Storage: `portafolio-assets/certificates/`
7. Se obtiene URL pública
8. URL se guarda en `certificate_url` de la tabla `education`

**Vista pública:**
- Si existe `certificate_url`, se muestra icono Award (lucide-react)
- Click abre PDF en nueva pestaña

### Imágenes de Proyectos

Similar al flujo de certificados, pero:
- Acepta: JPG, PNG, WebP
- Carpeta: `projects/`
- Tabla: `project_images`

## 🎯 Próximos Pasos para Completar

### 1. CRUD de Proyectos
Crear `src/app/admin/projects/page.tsx` siguiendo el patrón de Education:
- Formulario con nombre, descripción, tech_stack (textarea separado por comas)
- URLs de repo y demo
- **Subida múltiple de imágenes**
- Marcar imagen principal

### 2. CRUD de Experiencia
Crear `src/app/admin/experience/page.tsx`:
- Similar a Education pero sin certificados
- Campos: company, position, dates, description

### 3. CRUD de Enlaces de Contacto
Crear `src/app/admin/contact-links/page.tsx`:
- Campos: platform, url, icon_name
- Select para elegir icono de lucide-react

### 4. CRUD de Configuración Global
Crear `src/app/admin/config/page.tsx`:
- Formulario único (no lista)
- Campos: role, headline, about_me_content
- **Subida de CV** (PDF)
- **Subida de imagen de fondo** para hero

### 5. Vista de Mensajes
Crear `src/app/admin/messages/page.tsx`:
- Listado de mensajes recibidos
- Marcar como leído/no leído
- Eliminar mensajes

## 🎨 Personalización de Diseño

### Colores

Los colores se definen en `src/app/globals.css`:
- Modo claro: `:root`
- Modo oscuro: `.dark`

### Fuentes

Configuradas en `src/app/layout.tsx`:
- **Sans**: Space Grotesk
- **Heading**: Orbitron

Para cambiar:
```typescript
import { Tu_Fuente } from "next/font/google"
```

### Gradientes

Los gradientes principales usan:
```css
from-green-400 to-blue-500
```

Para cambiar, busca y reemplaza en los componentes.

## 🐛 Solución de Problemas

### Error: "Cannot read properties of undefined"
- Verifica que las variables de entorno estén configuradas
- Reinicia el servidor de desarrollo

### Imágenes no se muestran
- Verifica que el bucket sea público
- Verifica `next.config.ts` tenga la configuración de imágenes remotas

### Error de autenticación
- Verifica que el usuario exista en Supabase Auth
- Verifica las credenciales en `.env.local`

### RLS bloquea operaciones
- Verifica que el usuario esté autenticado
- Revisa las políticas en Supabase

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)

## 🤝 Soporte

Para preguntas o problemas:
1. Revisa esta documentación
2. Consulta los logs de la consola
3. Verifica la configuración de Supabase
4. Revisa el código de ejemplo en los componentes existentes

---

**¡Proyecto listo para usar!** 🚀

Recuerda completar los CRUDs pendientes siguiendo el patrón de Education.
