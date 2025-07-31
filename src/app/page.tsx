'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calculator, 
  Users, 
  FileText, 
  BarChart3, 
  Smartphone, 
  Shield, 
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { user, loading, error } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error de Conexión</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Redirect will handle this
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Calculator className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Cotizador Herrería PRO</h1>
            </div>
            <div className="space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Iniciar Sesión</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Registrarse</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            El Sistema de Cotización
            <span className="text-blue-600 block">Más Completo para Herrerías</span>
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Crea cotizaciones profesionales, gestiona clientes, controla inventario y 
            aumenta tus ventas con la plataforma diseñada especialmente para herrerías mexicanas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="w-full sm:w-auto">
                Comenzar Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Ver Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas en una sola plataforma
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Diseñado específicamente para herrerías mexicanas, con todas las funciones 
              que necesitas para hacer crecer tu negocio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Calculator className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Cotizador Avanzado</CardTitle>
                <CardDescription>
                  Crea cotizaciones detalladas con múltiples trabajos, materiales y 
                  precios actualizados por estado.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Gestión de Clientes</CardTitle>
                <CardDescription>
                  Base de datos completa con historial de trabajos, contacto directo 
                  por WhatsApp y seguimiento de proyectos.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>PDFs Profesionales</CardTitle>
                <CardDescription>
                  Genera cotizaciones en PDF con tu logo, datos fiscales y envío 
                  automático por email y WhatsApp.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>Reportes y Analytics</CardTitle>
                <CardDescription>
                  Analiza tus ventas, materiales más usados, clientes frecuentes 
                  y exporta todo a Excel.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Smartphone className="h-12 w-12 text-pink-600 mb-4" />
                <CardTitle>App Móvil (PWA)</CardTitle>
                <CardDescription>
                  Instala como app en tu celular, funciona offline y sincroniza 
                  cuando tengas internet.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>Facturación 4.0</CardTitle>
                <CardDescription>
                  Cumple con el SAT mexicano: CFDI, regímenes fiscales, métodos 
                  de pago y todos los campos obligatorios.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Calculator className="h-8 w-8 text-blue-400 mr-3" />
              <span className="text-xl font-bold">Herrería PRO</span>
            </div>
            <p className="text-gray-400 mb-8">
              El sistema de cotización más completo para herrerías mexicanas.
            </p>
            <p className="text-gray-400">
              &copy; 2025 Cotizador Herrería PRO. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
