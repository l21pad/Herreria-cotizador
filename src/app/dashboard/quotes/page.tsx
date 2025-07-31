'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calculator, 
  PlusCircle, 
  Search, 
  FileText, 
  Eye, 
  Edit, 
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface Quote {
  id: string;
  quote_number: string;
  client: {
    name: string;
  };
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';
  total: number;
  valid_until: string;
  created_at: string;
}

const statusConfig = {
  draft: { label: 'Borrador', icon: Edit, color: 'text-gray-600 bg-gray-100' },
  sent: { label: 'Enviada', icon: Clock, color: 'text-blue-600 bg-blue-100' },
  approved: { label: 'Aprobada', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
  rejected: { label: 'Rechazada', icon: XCircle, color: 'text-red-600 bg-red-100' },
  expired: { label: 'Vencida', icon: AlertTriangle, color: 'text-orange-600 bg-orange-100' }
};

export default function QuotesPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (profile?.id) {
      fetchQuotes();
    }
  }, [profile]);

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          id,
          quote_number,
          status,
          total,
          valid_until,
          created_at,
          client_id,
          clients (
            name
          )
        `)
        .eq('profile_id', profile!.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching quotes:', error);
        toast.error('Error al cargar las cotizaciones');
        return;
      }

      // Transform the data to match our interface
      const transformedData = data?.map((quote: any) => ({
        id: quote.id,
        quote_number: quote.quote_number,
        status: quote.status,
        total: quote.total,
        valid_until: quote.valid_until,
        created_at: quote.created_at,
        client: { 
          name: quote.clients?.name || 'Cliente desconocido' 
        }
      })) || [];

      setQuotes(transformedData);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado al cargar las cotizaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuote = async (quoteId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta cotización? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', quoteId);

      if (error) {
        toast.error('Error al eliminar la cotización');
        return;
      }

      toast.success('Cotización eliminada exitosamente');
      fetchQuotes();
    } catch (error) {
      toast.error('Error inesperado al eliminar la cotización');
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.quote_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.client.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Calculator className="h-8 w-8 mr-3 text-blue-600" />
            Cotizaciones
          </h1>
          <p className="text-gray-600 mt-1">
            Gestiona todas tus cotizaciones de herrería
          </p>
        </div>
        <Button asChild className="mt-4 sm:mt-0">
          <Link href="/dashboard/quotes/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            Nueva Cotización
          </Link>
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por número de cotización o cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los estados</option>
                <option value="draft">Borradores</option>
                <option value="sent">Enviadas</option>
                <option value="approved">Aprobadas</option>
                <option value="rejected">Rechazadas</option>
                <option value="expired">Vencidas</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando cotizaciones...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredQuotes.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {quotes.length === 0 ? 'No tienes cotizaciones aún' : 'No se encontraron cotizaciones'}
            </h3>
            <p className="text-gray-600 mb-6">
              {quotes.length === 0 
                ? 'Crea tu primera cotización para comenzar a gestionar tus trabajos de herrería'
                : 'Intenta ajustar los filtros de búsqueda'
              }
            </p>
            {quotes.length === 0 && (
              <Button asChild>
                <Link href="/dashboard/quotes/new">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Crear Primera Cotización
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quotes List */}
      {!loading && filteredQuotes.length > 0 && (
        <div className="space-y-4">
          {filteredQuotes.map((quote) => {
            const StatusIcon = statusConfig[quote.status].icon;
            const isExpired = new Date(quote.valid_until) < new Date() && quote.status !== 'approved';
            
            return (
              <Card key={quote.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Calculator className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {quote.quote_number}
                        </h3>
                        <p className="text-gray-600">{quote.client.name}</p>
                        <div className="flex items-center mt-1 space-x-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[quote.status].color}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig[quote.status].label}
                          </span>
                          {isExpired && quote.status === 'sent' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-red-600 bg-red-100">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Vencida
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        ${quote.total.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        Válida hasta: {new Date(quote.valid_until).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        Creada: {new Date(quote.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end mt-4 space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/quotes/${quote.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/quotes/${quote.id}/edit`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteQuote(quote.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Summary Stats */}
      {!loading && quotes.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Resumen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(statusConfig).map(([status, config]) => {
                const count = quotes.filter(q => q.status === status).length;
                const StatusIcon = config.icon;
                
                return (
                  <div key={status} className="text-center">
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${config.color} mb-2`}>
                      <StatusIcon className="h-4 w-4" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{count}</div>
                    <div className="text-sm text-gray-600">{config.label}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
