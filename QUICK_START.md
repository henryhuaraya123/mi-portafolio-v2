# 🚀 Guía Rápida de Uso - Portafolio Dinámico

## ⚡ Inicio Rápido

### 1. Configurar Supabase (5 minutos)

#### a) Crear Proyecto
1. Ve a [supabase.com](https://supabase.com)
2. Click en "New Project"
3. Completa:
   - Nombre del proyecto
   - Contraseña de base de datos
   - Región
4. Espera a que se cree el proyecto

#### b) Ejecutar SQL
1. Ve a **SQL Editor** en el menú lateral
2. Click en "New Query"
3. Copia y pega todo el contenido de `database-schema.sql`
4. Click en "Run" o presiona `Ctrl+Enter`
5. Verifica que se ejecutó sin errores

#### c) Crear Bucket de Storage
1. Ve a **Storage** en el menú lateral
2. Click en "Create bucket"
3. Nombre: `portafolio-assets`
4. **Importante:** Marca como "Public bucket"
5. Click en "Create bucket"

#### d) Crear Usuario Admin
1. Ve a **Authentication** en el menú lateral
2. Click en "Add user" → "Create new user"
3. Completa:
   - Email: tu@email.com
   - Password: (tu contraseña segura)
4. Click en "Create user"

#### e) Obtener Credenciales
1. Ve a **Project Settings** (ícono de engranaje)
2. Click en **API**
3. Copia:
   - `Project URL` → Esta es tu `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → Esta es tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

### 2. Configurar Variables de Entorno (1 minuto)

Crea el archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-muy-larga-aqui
```

**Importante:** Reemplaza los valores con los que copiaste de Supabase.

---

### 3. Ejecutar el Proyecto (30 segundos)

```bash
# Si no has instalado las dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

El proyecto estará disponible en: **http://localhost:3000**

---

## 🎯 Primeros Pasos en el Admin

### 1. Iniciar Sesión

1. Ve a: **http://localhost:3000/login**
2. Ingresa el email y contraseña que creaste en Supabase
3. Click en "Iniciar Sesión"
4. Serás redirigido al dashboard

---

### 2. Configurar Información Básica

#### a) Configuración Global (PRIMERO)
1. En el dashboard, click en **"Configuración Global"**
2. Completa:
   - **Rol/Título:** Ej. "Full Stack Developer"
   - **Headline:** Ej. "Construyendo experiencias web excepcionales"
   - **Sobre Mí:** Escribe un párrafo sobre ti
3. **Opcional:** Sube tu CV (PDF)
4. **Opcional:** Sube una imagen de fondo para el Hero
5. Click en **"Guardar Configuración"**

---

### 3. Agregar Contenido

#### b) Proyectos
1. Click en **"Proyectos"**
2. Click en **"Nuevo Proyecto"**
3. Completa:
   - Nombre: "Mi Portafolio"
   - Descripción: "Portafolio personal..."
   - Tecnologías: "React, Next.js, TypeScript" (separadas por comas)
   - URL del Repositorio: https://github.com/...
   - URL del Demo: https://...
4. **Subir Imágenes:**
   - Click en "Choose Files"
   - Selecciona una o varias imágenes
   - Espera a que se suban
   - Click en el ícono de imagen para marcar una como principal
5. Click en **"Guardar"**

#### c) Educación
1. Click en **"Educación"**
2. Click en **"Nueva Educación"**
3. Completa:
   - Institución: "Universidad X"
   - Título/Curso: "Ingeniería en Sistemas"
   - Fecha de inicio: Selecciona la fecha
   - Fecha de fin: Selecciona o deja vacío si es actual
   - Descripción: (opcional)
4. **Subir Certificado:**
   - Click en "Choose File"
   - Selecciona un PDF
   - Espera a que se suba
5. Click en **"Guardar"**

#### d) Experiencia
1. Click en **"Experiencia"**
2. Click en **"Nueva Experiencia"**
3. Completa:
   - Empresa: "Tech Company"
   - Cargo: "Full Stack Developer"
   - Fecha de inicio: Selecciona
   - Fecha de fin: Deja vacío si es trabajo actual
   - Descripción: Describe tus responsabilidades
4. Click en **"Guardar"**

#### e) Enlaces de Contacto
1. Click en **"Enlaces de Contacto"**
2. Click en **"Nuevo Enlace"**
3. Completa:
   - Plataforma: "GitHub"
   - URL: https://github.com/tuusuario
   - Icono: Selecciona "GitHub" del dropdown
4. Click en **"Guardar"**
5. Repite para LinkedIn, Twitter, Email, etc.

---

### 4. Ver tu Portafolio

1. Click en **"Ver Portafolio"** en el header del admin
2. O ve directamente a: **http://localhost:3000**
3. Verás todas las secciones con el contenido que agregaste

---

## 📧 Recibir Mensajes de Contacto

### Cuando alguien envía un mensaje:

1. El mensaje se guarda automáticamente en la base de datos
2. Ve a **"Mensajes"** en el admin
3. Verás un contador de mensajes sin leer
4. Click en un mensaje para ver el detalle completo
5. Click en **"Responder"** para abrir tu cliente de email
6. Puedes marcar como leído/no leído
7. Puedes eliminar mensajes

---

## 🎨 Personalización

### Cambiar Colores

Edita `src/app/globals.css`:

```css
/* Para modo claro */
:root {
  --primary: oklch(0.205 0 0); /* Cambia estos valores */
}

/* Para modo oscuro */
.dark {
  --primary: oklch(0.922 0 0); /* Cambia estos valores */
}
```

### Cambiar Fuentes

Edita `src/app/layout.tsx`:

```typescript
import { Tu_Fuente } from "next/font/google"

const tuFuente = Tu_Fuente({
  variable: "--font-tu-fuente",
  subsets: ["latin"],
})
```

---

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Compilar para producción
npm run build

# Ejecutar en producción
npm start

# Linter
npm run lint
```

---

## 🐛 Solución de Problemas Comunes

### Error: "Invalid Supabase URL"
- Verifica que `.env.local` existe
- Verifica que las URLs no tienen espacios
- Reinicia el servidor (`Ctrl+C` y `npm run dev`)

### Las imágenes no se muestran
- Verifica que el bucket sea público
- Ve a Storage → portafolio-assets → Settings → Public bucket: ON

### No puedo iniciar sesión
- Verifica que el usuario existe en Supabase Auth
- Verifica que la contraseña es correcta
- Revisa la consola del navegador para errores

### Error de RLS (Row Level Security)
- Verifica que ejecutaste todo el `database-schema.sql`
- Las políticas de RLS deben estar creadas

---

## 📱 Despliegue en Vercel

### 1. Preparar el Proyecto
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/tuusuario/tu-repo.git
git push -u origin main
```

### 2. Desplegar en Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Click en "Import Project"
3. Selecciona tu repositorio
4. Agrega las variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click en "Deploy"

### 3. Configurar Dominio (Opcional)
1. Ve a Settings → Domains
2. Agrega tu dominio personalizado
3. Sigue las instrucciones de DNS

---

## 📚 Recursos Adicionales

- **Documentación Completa:** `IMPLEMENTATION.md`
- **Resumen de CRUDs:** `CRUDS_COMPLETED.md`
- **Estado del Proyecto:** `PROJECT_STATUS.md`
- **Esquema de BD:** `database-schema.sql`

---

## 🎉 ¡Listo!

Tu Portafolio dinámico está configurado y funcionando. Ahora puedes:

✅ Agregar más proyectos  
✅ Actualizar tu información  
✅ Recibir mensajes de contacto  
✅ Gestionar todo desde el admin  
✅ Compartir tu Portafolio con el mundo  

**¡Disfruta de tu nuevo Portafolio!** 🚀

---

**Tiempo total de configuración:** ~10 minutos  
**Dificultad:** Fácil  
**Soporte:** Revisa la documentación en los archivos `.md`
