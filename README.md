# Cotizador Herrería PRO

Sistema profesional de cotización para herrerías mexicanas. Una aplicación web completa con funcionalidades avanzadas de gestión de cotizaciones, clientes, materiales y reportes.

## 🚀 Características Principales

### ✨ Funcionalidades Core
- **Cotizador Avanzado**: Múltiples trabajos por cotización con materiales personalizables
- **Gestión de Clientes**: Base de datos completa con historial de proyectos
- **Catálogo de Materiales**: Precios por estado, control de inventario opcional
- **PDFs Profesionales**: Cotizaciones con logo personalizado y datos fiscales
- **Sistema Fiscal Mexicano**: Soporte completo para facturación 4.0 (CFDI, SAT)
- **Galería de Trabajos**: Organizada por categorías con almacenamiento ilimitado (PRO)
- **Reportes y Analytics**: Ventas, utilidades, materiales más usados, exportable a Excel
- **PWA**: Instalable como app móvil, funciona offline

### 👥 Sistema de Usuarios
- **Administradores**: Acceso completo a todas las funciones
- **Colaboradores**: Crear cotizaciones y gestionar clientes (sin acceso a configuraciones)
- **Invitaciones**: Sistema de invitación por email para colaboradores

### 💰 Planes de Suscripción
- **Plan Gratuito**: 10 cotizaciones/mes, funcionalidades básicas
- **Plan PRO ($299/mes)**: Cotizaciones ilimitadas, todas las funciones premium

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Pagos**: Stripe para suscripciones
- **Emails**: SendGrid para notificaciones
- **UI**: Radix UI + Headless UI
- **PWA**: next-pwa
- **Deployment**: Vercel

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta en Supabase
- Cuenta en Stripe
- Cuenta en SendGrid
- Cuenta en Vercel (para deploy)

### 1. Clonar y configurar el proyecto

```bash
# Clonar el repositorio
git clone [url-del-repo]
cd herreria-cotizador

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local
```

### 2. Configurar Supabase

1. Crear un nuevo proyecto en [Supabase](https://supabase.com)
2. Ir a Settings > API y obtener:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

3. Ejecutar las migraciones SQL (ver `database/schema.sql`)

### 3. Configurar Stripe

1. Crear cuenta en [Stripe](https://stripe.com)
2. Obtener las claves de API:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`

3. Configurar webhooks en Stripe Dashboard:
   - URL: `https://tu-dominio.com/api/webhooks/stripe`
   - Eventos: `invoice.payment_succeeded`, `customer.subscription.updated`, `customer.subscription.deleted`

### 4. Configurar SendGrid

1. Crear cuenta en [SendGrid](https://sendgrid.com)
2. Crear API Key
3. Verificar dominio de envío
4. Configurar:
   - `SENDGRID_API_KEY`
   - `SENDGRID_FROM_EMAIL`

### 5. Configurar Google OAuth (Opcional)

1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. Crear proyecto y habilitar Google+ API
3. Crear credenciales OAuth 2.0
4. Configurar:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

### 6. Variables de Entorno Completas

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# SendGrid
SENDGRID_API_KEY=SG....
SENDGRID_FROM_EMAIL=noreply@tu-dominio.com

# Next Auth
NEXTAUTH_SECRET=tu_string_secreto_aleatorio
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret

# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Cotizador Herrería PRO"
```

## 🗄️ Base de Datos

### Estructura de Tablas Principales

```sql
-- Perfiles de herrería
profiles (
  id, user_id, business_name, logo_url, address, state, rfc,
  phone, email, fiscal_regime, is_pro, pro_expires_at
)

-- Materiales
materials (
  id, profile_id, name, unit, price, stock, min_stock, category
)

-- Clientes
clients (
  id, profile_id, name, phone, email, address, rfc, fiscal_regime
)

-- Cotizaciones
quotes (
  id, profile_id, client_id, quote_number, status, subtotal,
  tax_amount, total, advance_payment, requires_invoice
)

-- Trabajos (múltiples por cotización)
jobs (
  id, quote_id, type, description, width, height, depth,
  quantity, labor_cost, additional_costs
)

-- Materiales por trabajo
job_materials (
  id, job_id, material_id, quantity, unit_price, total_price
)

-- Galería
gallery (
  id, profile_id, title, description, category, image_url
)

-- Colaboradores
collaborators (
  id, profile_id, user_id, invited_email, status
)
```

### Ejecutar Migraciones

```bash
# Conectar a Supabase y ejecutar schema.sql
# (Ver archivo database/schema.sql para las tablas completas)
```

## 🚀 Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Verificar tipos de TypeScript
npm run type-check

# Lint del código
npm run lint

# Build para producción
npm run build
```

## 📱 PWA (Progressive Web App)

La aplicación está configurada como PWA y puede instalarse en dispositivos móviles:

1. Abrir la app en el navegador móvil
2. Usar "Agregar a pantalla de inicio"
3. La app funcionará offline y se sincronizará cuando haya conexión

## 🔧 Funcionalidades Detalladas

### Cotizador
- ✅ Múltiples trabajos por cotización
- ✅ Cálculo automático de materiales y costos
- ✅ Aplicación de descuentos e IVA
- ✅ Observaciones por trabajo y generales
- ✅ Duplicación de cotizaciones anteriores

### Clientes
- ✅ CRUD completo de clientes
- ✅ Historial de cotizaciones por cliente
- ✅ Contacto directo por WhatsApp/Email
- ✅ Búsqueda y filtrado avanzado

### Materiales
- ✅ Catálogo precargado por estado
- ✅ Materiales personalizados
- ✅ Control de inventario opcional
- ✅ Alertas de stock bajo

### Reportes
- ✅ Ventas por período
- ✅ Materiales más utilizados
- ✅ Clientes frecuentes
- ✅ Exportación a Excel/PDF

### Galería
- ✅ Organizada por categorías
- ✅ Almacenamiento en Supabase Storage
- ✅ Límites por plan (Gratis vs PRO)

## 🌐 Deployment

### Vercel (Recomendado)

1. Conectar repositorio a Vercel
2. Configurar variables de entorno en Vercel Dashboard
3. Deploy automático en cada push a main

```bash
# CLI de Vercel (opcional)
npm i -g vercel
vercel --prod
```

### Variables de Entorno en Vercel

Configurar todas las variables de `.env.local` en:
- Vercel Dashboard > Project > Settings > Environment Variables

## 🧪 Testing

### Funcionalidades a Probar

1. **Autenticación**
   - Registro con email
   - Login con email/password
   - Login con Google
   - Recuperación de contraseña

2. **Cotizaciones**
   - Crear cotización con múltiples trabajos
   - Agregar materiales a cada trabajo
   - Calcular totales correctamente
   - Generar PDF
   - Enviar por email/WhatsApp

3. **Gestión de Clientes**
   - Crear, editar, eliminar clientes
   - Buscar clientes
   - Ver historial de cotizaciones

4. **Materiales**
   - Agregar materiales personalizados
   - Editar precios
   - Control de inventario

5. **Reportes**
   - Generar reportes de ventas
   - Exportar a Excel
   - Filtrar por fechas

6. **PWA**
   - Instalar como app
   - Funcionalidad offline básica

## 🐛 Solución de Problemas

### Errores Comunes

1. **Error de conexión a Supabase**
   - Verificar URLs y claves de API
   - Comprobar configuración de CORS en Supabase

2. **Errores de autenticación**
   - Verificar configuración de Google OAuth
   - Comprobar redirect URLs

3. **Errores de Stripe**
   - Verificar webhooks configurados correctamente
   - Comprobar claves de API (test vs live)

4. **Problemas de email**
   - Verificar configuración de SendGrid
   - Comprobar dominio verificado

## 📝 Próximas Funcionalidades

- [ ] Notificaciones push
- [ ] Integración con WhatsApp Business API
- [ ] Plantillas de cotización personalizables
- [ ] Módulo de facturación automática
- [ ] API para integraciones externas
- [ ] App móvil nativa

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto es propiedad privada. Todos los derechos reservados.

## 🆘 Soporte

Para soporte técnico:
- Email: soporte@herreriapro.com
- Documentación: [docs.herreriapro.com]
- Discord: [Enlace al servidor de Discord]

---

**Cotizador Herrería PRO** - Moderniza tu herrería con tecnología de vanguardia 🔧⚡
