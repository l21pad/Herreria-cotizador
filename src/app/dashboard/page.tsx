'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calculator, 
  Users, 
  FileText, 
  Package, 
  TrendingUp, 
  PlusCircle,
  DollarSign,
  Clock,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalQuotes: 0,
    pendingQuotes: 0,
    approvedQuotes: 0,
    totalClients: 0,
    monthlyRevenue: 0,
    recentQuotes: []
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const quickActions = [
    {
      title: 'Nueva Cotización',
      description: 'Crear una cotización para un cliente',
      icon: Calculator,
      href: '/dashboard/quotes/new',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Agregar Cliente',
      description: 'Registrar un nuevo cliente',
      icon: Users,
      href: '/dashboard/clients/new',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Gestionar Materiales',
      description: 'Actualizar precios y stock',
      icon: Package,
      href: '/dashboard/materials',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Ver Galería',
      description: 'Administrar trabajos realizados',
      icon: FileText,
      href: '/dashboard/gallery',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  const statCards = [
    {
      title: 'Cotizaciones Totales',
      value: stats.totalQuotes,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Cotizaciones Pendientes',
      value: stats.pendingQuotes,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Cotizaciones Aprobadas',
      value: stats.approvedQuotes,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Clientes Totales',
      value: stats.totalClients,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                ¡Bienvenido, {profile?.business_name || 'Usuario'}!
              </h1>
              <p className="text-gray-600">
                Gestiona tu herrería de manera profesional
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {!profile?.is_pro && (
                <Button asChild variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50">
                  <Link href="/dashboard/upgrade">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Actualizar a PRO
                  </Link>
                </Button>
              )}
              <Button asChild>
                <Link href="/dashboard/quotes/new">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Nueva Cotización
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>
                Las tareas más comunes de tu herrería
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  asChild
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start space-y-2"
                >
                  <Link href={action.href}>
                    <div className={`${action.color} p-2 rounded-lg text-white`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">{action.title}</div>
                      <div className="text-sm text-gray-500">{action.description}</div>
                    </div>
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>
                Últimas cotizaciones y actividad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentQuotes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No hay cotizaciones recientes</p>
                    <p className="text-sm">Crea tu primera cotización para comenzar</p>
                  </div>
                ) : (
                  stats.recentQuotes.map((quote: any, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{quote.client_name}</p>
                        <p className="text-sm text-gray-600">{quote.quote_number}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${quote.total?.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{quote.status}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Status */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Estado de la Cuenta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  Plan: {profile?.is_pro ? 'PRO' : 'Gratuito'}
                </p>
                <p className="text-sm text-gray-600">
                  {profile?.is_pro 
                    ? `Válido hasta: ${profile.pro_expires_at ? new Date(profile.pro_expires_at).toLocaleDateString() : 'N/A'}`
                    : 'Actualiza para desbloquear todas las funciones'
                  }
                </p>
              </div>
              {!profile?.is_pro && (
                <Button asChild variant="default">
                  <Link href="/dashboard/upgrade">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Actualizar a PRO
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
