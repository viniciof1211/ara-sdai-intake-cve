# SDAI Intake (CVE) - ARA Group

Sistema de gestión de intakes enterprise para la plataforma CVE (Production-First MVP Factory), diseñado con calidad consultora tier-1.

## Tecnologías

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL + Prisma ORM
- **Autenticación**: NextAuth.js con Microsoft Entra ID (Azure AD) SSO
- **IA**: Google Vertex AI (Gemini) en GCP proyecto `ara-next-ai`
- **Despliegue**: Vercel (production-ready)

## Características Principales

### Autenticación & Autorización
- SSO con Microsoft Entra ID (Azure AD)
- 3 roles: **Admin**, **Architect**, **Viewer**
- Control granular de permisos (crear, editar, eliminar, submit)

### Gestión de Intakes
- Wizard de 7 tabs con validación
- Dashboard con KPIs y estadísticas
- Filtros y búsqueda avanzada
- Estados: draft → submitted → provisioning → active → archived

### Copiloto IA (Vertex AI Gemini)
- **Auto-Completar Ontología**: Extrae objetos, relaciones y acciones de notas libres
- **Sugerir KPIs**: Propone KPIs relevantes basados en dolores y procesos
- **Proponer MVP 30/60/90**: Genera roadmap con priorización MUST/SHOULD/COULD
- **Generar Executive Summary**: One-pager consulting-grade

### Componentes Avanzados
- Tablas editables in-line (data sources, ontology, permissions matrix)
- One-pager PDF-ready (print view)
- Export JSON
- Admin panel para gestión de estados

## Estructura del Proyecto

```
.
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/     # NextAuth config
│   │   ├── intakes/                # CRUD de intakes
│   │   ├── copilot/                # 4 endpoints Gemini
│   │   ├── provision/              # Provisioning stub
│   │   └── stats/                  # Dashboard stats
│   ├── intakes/
│   │   ├── page.tsx                # Lista con filtros
│   │   ├── new/page.tsx            # Wizard crear
│   │   ├── [id]/page.tsx           # Detalle + Copilot
│   │   └── [id]/print/page.tsx     # One-pager
│   ├── admin/page.tsx              # Admin panel
│   ├── page.tsx                    # Dashboard
│   ├── layout.tsx                  # Root layout
│   └── providers.tsx               # SessionProvider
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── wizard-tabs/                # 7 tabs del intake
│   ├── Navbar.tsx                  # Navigation bar
│   ├── IntakeWizard.tsx            # Wizard container
│   ├── EditableTable.tsx           # Reusable editable table
│   └── CopilotPanel.tsx            # Panel IA
├── lib/
│   ├── auth.ts                     # AuthOptions & permisos
│   ├── prisma.ts                   # Prisma client
│   ├── vertex-ai.ts                # Vertex AI integration
│   ├── prompts/                    # Prompt templates
│   └── types/                      # TypeScript types
├── prisma/
│   └── schema.prisma               # Database schema
├── .env                            # Environment variables
└── README.md
```

## Requisitos Previos

- Node.js 18+
- npm o yarn
- PostgreSQL database (o Supabase)
- Cuenta Azure AD (para SSO)
- GCP Service Account con Vertex AI habilitado

## Instalación Local

### 1. Clonar e instalar dependencias

```bash
git clone <repo-url>
cd sdai-intake-cve
npm install
```

### 2. Configurar variables de entorno

Crea o edita el archivo `.env`:

```bash
# Database (Supabase, Neon, o Postgres local)
DATABASE_URL=postgresql://user:password@host:5432/database

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<genera con: openssl rand -base64 32>

# Azure AD SSO
AZURE_AD_CLIENT_ID=<tu-azure-ad-client-id>
AZURE_AD_CLIENT_SECRET=<tu-azure-ad-client-secret>
AZURE_AD_TENANT_ID=<tu-azure-ad-tenant-id>

# Google Vertex AI
GOOGLE_CLOUD_PROJECT=ara-next-ai
GOOGLE_CLOUD_REGION=us-central1
VERTEX_MODEL_FAST=gemini-1.5-flash
VERTEX_MODEL_QUALITY=gemini-1.5-pro
GCP_SA_KEY_JSON={"type":"service_account","project_id":"ara-next-ai",...}
```

**Nota sobre `GCP_SA_KEY_JSON`**:
- Debe ser un JSON de Service Account en una sola línea
- Para convertir un archivo JSON multilínea: `cat key.json | jq -c . | pbcopy`

### 3. Configurar Azure AD

1. Ve a [Azure Portal](https://portal.azure.com/) → Azure Active Directory → App Registrations
2. Crea una nueva app registration o usa una existente
3. En **Authentication** → **Platform configurations**:
   - Add platform: Web
   - Redirect URIs: `http://localhost:3000/api/auth/callback/azure-ad` (local) y `https://tu-dominio.vercel.app/api/auth/callback/azure-ad` (prod)
4. En **Certificates & secrets**: Crea un nuevo client secret
5. Copia `Application (client) ID`, `Directory (tenant) ID`, y el secret generado

### 4. Configurar Vertex AI en GCP

1. Ve a [GCP Console](https://console.cloud.google.com/)
2. Crea o usa el proyecto `ara-next-ai`
3. Habilita **Vertex AI API**
4. Crea un Service Account:
   - IAM & Admin → Service Accounts → Create
   - Rol: `Vertex AI User`
   - Genera y descarga la key JSON
5. Convierte el JSON a una sola línea y pégalo en `GCP_SA_KEY_JSON`

### 5. Ejecutar migraciones

```bash
npx prisma migrate dev
npx prisma generate
```

### 6. Iniciar servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Despliegue en Vercel

### Paso 1: Preparar el repositorio

```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

### Paso 2: Conectar con Vercel

1. Ve a [vercel.com](https://vercel.com/) y crea una cuenta
2. Importa tu repositorio de GitHub/GitLab
3. Configura el proyecto:
   - **Framework Preset**: Next.js
   - **Root Directory**: `.`
   - **Build Command**: `next build`
   - **Output Directory**: `.next`

### Paso 3: Configurar Base de Datos

**Opción A: Supabase**
1. Crea un proyecto en [supabase.com](https://supabase.com/)
2. Ve a Settings → Database y copia el `Connection String` (con pooling)
3. Pégalo como `DATABASE_URL` en Vercel

**Opción B: Neon**
1. Crea una DB en [neon.tech](https://neon.tech/)
2. Copia el connection string
3. Pégalo como `DATABASE_URL` en Vercel

**Opción C: Azure Database for PostgreSQL**
1. Crea una instancia en Azure Portal
2. Configura firewall para permitir conexiones de Vercel
3. Usa el connection string

### Paso 4: Configurar Variables de Entorno en Vercel

En **Project Settings → Environment Variables**, agrega:

```
DATABASE_URL=<tu-postgres-connection-string>
NEXTAUTH_URL=https://tu-app.vercel.app
NEXTAUTH_SECRET=<mismo-secret-que-local-o-genera-nuevo>
AZURE_AD_CLIENT_ID=<tu-azure-ad-client-id>
AZURE_AD_CLIENT_SECRET=<tu-azure-ad-client-secret>
AZURE_AD_TENANT_ID=<tu-azure-ad-tenant-id>
GOOGLE_CLOUD_PROJECT=ara-next-ai
GOOGLE_CLOUD_REGION=us-central1
VERTEX_MODEL_FAST=gemini-1.5-flash
VERTEX_MODEL_QUALITY=gemini-1.5-pro
GCP_SA_KEY_JSON=<service-account-json-en-una-linea>
```

**Importante**:
- `GCP_SA_KEY_JSON` debe estar en una sola línea (sin saltos de línea)
- `NEXTAUTH_URL` debe ser la URL de producción de Vercel

### Paso 5: Ejecutar Migraciones en Producción

Después del primer deploy, ejecuta desde tu terminal local:

```bash
DATABASE_URL="<production-database-url>" npx prisma migrate deploy
```

O usa Vercel CLI:

```bash
vercel env pull .env.production.local
npx prisma migrate deploy
```

### Paso 6: Actualizar Azure AD Redirect URIs

En Azure Portal → App Registration → Authentication:
- Agrega: `https://tu-app.vercel.app/api/auth/callback/azure-ad`

### Paso 7: Deploy

```bash
git push origin main
```

Vercel detectará el push y deployará automáticamente.

## Roles y Permisos

| Rol       | Ver | Crear | Editar | Eliminar | Submit | Admin Panel |
|-----------|-----|-------|--------|----------|--------|-------------|
| Viewer    | ✅  | ❌    | ❌     | ❌       | ❌     | ❌          |
| Architect | ✅  | ✅    | ✅     | ❌       | ✅     | ❌          |
| Admin     | ✅  | ✅    | ✅     | ✅       | ✅     | ✅          |

**Asignación de roles**: Actualmente basada en email (ver `lib/auth.ts` función `getUserRole`). Para producción, se recomienda usar claims de Azure AD o una tabla de usuarios en DB.

## Schema de Base de Datos

### Tabla `intakes`
- `id` (UUID, PK)
- `clientProject` (String, indexed)
- `industry`, `businessUnit`, `sponsorExec`, `techContact`
- `status` (draft|submitted|provisioning|active|archived)
- `payload` (JSONB) - contiene el `IntakePayload` completo
- `createdByEmail`, `lastSubmittedAt`
- `createdAt`, `updatedAt`

### Tabla `action_logs`
- `id` (UUID, PK)
- `intakeId` (FK → intakes)
- `userEmail`, `actionName` (extractOntology|suggestKPIs|etc)
- `latencyMs`, `status`, `errorMessage`
- `requestHash` (para dedupe de requests)
- `responsePreview` (JSON corto del resultado)
- `createdAt`

## API Endpoints

### Auth
- `GET/POST /api/auth/[...nextauth]` - NextAuth handler

### Intakes
- `GET /api/intakes` - Lista (con filtros `?status=draft&search=`)
- `POST /api/intakes` - Crear nuevo
- `GET /api/intakes/[id]` - Obtener por ID
- `PUT /api/intakes/[id]` - Actualizar
- `DELETE /api/intakes/[id]` - Eliminar (solo Admin)

### Stats
- `GET /api/stats` - Estadísticas del dashboard

### Provisioning
- `POST /api/provision` - Enviar intake y cambiar a status `provisioning`

### Copilot (Vertex AI)
- `POST /api/copilot/extractOntology`
- `POST /api/copilot/suggestKPIs`
- `POST /api/copilot/suggestMVPPlan`
- `POST /api/copilot/generateExecutiveSummary`

Todos los endpoints de Copilot:
- Requieren autenticación
- Validan con Zod
- Implementan dedupe via `requestHash`
- Implementan retry/backoff en 429
- Loguean en `action_logs`

## Copilot: Detalles Técnicos

### Modelos Usados
- **gemini-1.5-flash** (FAST): extractOntology, suggestKPIs, suggestMVPPlan (payload pequeño)
- **gemini-1.5-pro** (QUALITY): generateExecutiveSummary, suggestMVPPlan (payload grande)

### Guardrails
- No inventar sistemas no mencionados
- Marcar campos faltantes como "REQUIERE VALIDACIÓN"
- Output siempre en JSON estructurado + explicación
- Tono formal español (consulting-grade)

### Deduplicación
- Cada request se hashea con SHA256 (`lib/vertex-ai.ts`)
- Se busca en `action_logs` si ya existe un resultado `ok` con ese hash
- Si existe, se devuelve desde caché (más rápido, sin costo Gemini)

## UI/UX: Paleta de Colores

- **Primary (ARA Green)**: `#1A4A28` (HSL: 149 48% 20%)
- **Background**: `#FFFFFF`
- **Borders**: `#E6E6E6` (90% gray)
- **Text**: `#1A1A1A` (10% gray)

Configurado en `app/globals.css` como custom Tailwind theme.

## Scripts Útiles

```bash
# Desarrollo
npm run dev

# Build producción
npm run build
npm run start

# Linting
npm run lint

# Type checking
npm run typecheck

# Prisma Studio (UI para DB)
npx prisma studio

# Regenerar Prisma Client
npx prisma generate

# Reset DB (⚠️ borra todos los datos)
npx prisma migrate reset
```

## Troubleshooting

### Error: "Module not found: Can't resolve '@prisma/client'"
```bash
npx prisma generate
```

### Error: "Invalid `prisma.intake.findMany()` invocation"
Verifica que `DATABASE_URL` esté configurado y que las migraciones se hayan ejecutado:
```bash
npx prisma migrate deploy
```

### Error: "GCP_SA_KEY_JSON not configured"
Asegúrate de que el JSON esté en una sola línea y sea válido:
```bash
echo $GCP_SA_KEY_JSON | jq .
```

### Error: "Rate limit. Intente de nuevo."
Vertex AI tiene límites de rate. El sistema implementa retry/backoff automático, pero si persiste:
- Espera 1-2 minutos
- Verifica cuotas en GCP Console → Vertex AI → Quotas

### Error NextAuth: "NEXTAUTH_SECRET must be provided"
Genera un secret:
```bash
openssl rand -base64 32
```
Y agrégalo a `.env` como `NEXTAUTH_SECRET`

### Vertex AI: 403 Permission Denied
Verifica que el Service Account tenga el rol `Vertex AI User` en el proyecto `ara-next-ai`.

## TODO: Integraciones Futuras

El endpoint `/api/provision` actualmente es un stub que cambia el status a `provisioning`. Las integraciones pendientes incluyen:

1. **Terraform**: Provisionar infra en Azure/GCP según `cloud_strategy` y `compute_tier`
2. **GitHub**: Crear repositorio del proyecto con template
3. **Neo4j**: Cargar ontología (objects, links, actions) en grafo
4. **Monitoring**: Integrar con Datadog/Grafana
5. **Workload Identity Federation**: Reemplazar Service Account JSON por WIF para mayor seguridad

Estos TODOs están documentados en el código en `app/api/provision/route.ts`.

## Licencia

© 2024 ARA Group. Todos los derechos reservados.

---

**Contacto**: Para soporte o consultas técnicas, contacta al equipo de SDAI en ARA Group.

**Versión**: 1.0.0 (Production-Ready)
