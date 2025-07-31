# Copilot Instructions - Cotizador Herrería PRO

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Proyecto Overview
Este es un proyecto Next.js 14 con TypeScript para un sistema completo de cotización de herrería mexicana.

## Stack Tecnológico
- **Frontend**: Next.js 14 con App Router, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Pagos**: Stripe para suscripciones PRO
- **Emails**: SendGrid para envío de cotizaciones y notificaciones
- **PWA**: Configurado para instalación como app móvil
- **Deployment**: Vercel

## Funcionalidades Principales
1. **Autenticación completa** (registro, login, recuperación, Google OAuth)
2. **Sistema de roles** (Admin/Colaboradores)
3. **Cotizador avanzado** con múltiples trabajos por cotización
4. **Gestión de materiales** con precios editables por estado
5. **Base de datos de clientes** con historial
6. **Galería de trabajos** con categorías
7. **Reportes y analytics** exportables
8. **Sistema fiscal mexicano** (facturación 4.0)
9. **PWA** para uso móvil
10. **Respaldo completo** de datos

## Directrices de Código
- Usar español para toda la interfaz de usuario
- Implementar validaciones robustas en formularios
- Incluir feedback visual para todas las acciones
- Manejar estados de carga y error apropiadamente
- Seguir principios de accesibilidad
- Optimizar para dispositivos móviles
- Implementar confirmaciones antes de acciones destructivas

## Estructura de Datos
- Perfiles de herrería con datos fiscales completos
- Catálogo de materiales por estado/región
- Sistema de cotizaciones con múltiples trabajos
- Gestión de clientes con historial de proyectos
- Galería organizada por categorías de trabajo

## Consideraciones Especiales
- Todos los precios en pesos mexicanos
- Soporte para facturación SAT
- Diseño responsive para mobile-first
- Optimización para conexiones lentas
- Backup automático de datos importantes
