'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Save,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function NewClientPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    rfc: '',
    fiscal_regime: '',
    cfdi_use: '',
    payment_method: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Formato de email inválido';
    }

    if (formData.rfc && !/^[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{3}$/.test(formData.rfc.toUpperCase())) {
      newErrors.rfc = 'Formato de RFC inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    setLoading(true);

    try {
      const clientData = {
        profile_id: profile!.id,
        name: formData.name.trim(),
        phone: formData.phone.trim() || null,
        email: formData.email.trim() || null,
        address: formData.address.trim() || null,
        rfc: formData.rfc.toUpperCase().trim() || null,
        fiscal_regime: formData.fiscal_regime || null,
        cfdi_use: formData.cfdi_use || null,
        payment_method: formData.payment_method || null,
        notes: formData.notes.trim() || null
      };

      const { error } = await supabase
        .from('clients')
        .insert(clientData);

      if (error) {
        console.error('Error creating client:', error);
        toast.error('Error al crear el cliente');
        return;
      }

      toast.success('Cliente creado exitosamente');
      router.push('/dashboard/clients');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado al crear el cliente');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center mb-2">
            <Button variant="ghost" asChild className="mr-4">
              <Link href="/dashboard/clients">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Users className="h-8 w-8 mr-3 text-blue-600" />
              Nuevo Cliente
            </h1>
          </div>
          <p className="text-gray-600">
            Agrega un nuevo cliente a tu base de datos
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
            <CardDescription>
              Datos principales del cliente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="name">Nombre completo / Razón social *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Juan Pérez / Empresa SA de CV"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  disabled={loading}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="55 1234 5678"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="cliente@email.com"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  disabled={loading}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Calle, Número, Colonia, Ciudad, Estado"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fiscal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información Fiscal (Opcional)</CardTitle>
            <CardDescription>
              Datos necesarios para facturación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rfc">RFC</Label>
                <Input
                  id="rfc"
                  type="text"
                  placeholder="ABC123456XYZ"
                  value={formData.rfc}
                  onChange={(e) => updateFormData('rfc', e.target.value.toUpperCase())}
                  disabled={loading}
                  className={errors.rfc ? 'border-red-500' : ''}
                  maxLength={13}
                />
                {errors.rfc && (
                  <p className="text-sm text-red-600 flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.rfc}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="fiscal_regime">Régimen Fiscal</Label>
                <select
                  id="fiscal_regime"
                  value={formData.fiscal_regime}
                  onChange={(e) => updateFormData('fiscal_regime', e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar régimen</option>
                  <option value="Régimen General de Ley Personas Morales">Régimen General de Ley Personas Morales</option>
                  <option value="Régimen de Incorporación Fiscal">Régimen de Incorporación Fiscal</option>
                  <option value="Régimen de Personas Físicas con Actividades Empresariales">Régimen de Personas Físicas con Actividades Empresariales</option>
                  <option value="Régimen de Pequeños Contribuyentes">Régimen de Pequeños Contribuyentes</option>
                  <option value="Régimen Intermedio de las Personas Físicas">Régimen Intermedio de las Personas Físicas</option>
                </select>
              </div>

              <div>
                <Label htmlFor="cfdi_use">Uso de CFDI</Label>
                <select
                  id="cfdi_use"
                  value={formData.cfdi_use}
                  onChange={(e) => updateFormData('cfdi_use', e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar uso</option>
                  <option value="G01">G01 - Adquisición de mercancías</option>
                  <option value="G02">G02 - Devoluciones, descuentos o bonificaciones</option>
                  <option value="G03">G03 - Gastos en general</option>
                  <option value="I01">I01 - Construcciones</option>
                  <option value="I02">I02 - Mobiliario y equipo de oficina por inversiones</option>
                  <option value="I03">I03 - Equipo de transporte</option>
                  <option value="I04">I04 - Equipo de computo y accesorios</option>
                  <option value="I05">I05 - Dados, troqueles, moldes, matrices y herramental</option>
                  <option value="I06">I06 - Comunicaciones telefónicas</option>
                  <option value="I07">I07 - Comunicaciones satelitales</option>
                  <option value="I08">I08 - Otra maquinaria y equipo</option>
                </select>
              </div>

              <div>
                <Label htmlFor="payment_method">Método de Pago</Label>
                <select
                  id="payment_method"
                  value={formData.payment_method}
                  onChange={(e) => updateFormData('payment_method', e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar método</option>
                  <option value="PUE">PUE - Pago en una sola exhibición</option>
                  <option value="PPD">PPD - Pago en parcialidades o diferido</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notas Adicionales</CardTitle>
            <CardDescription>
              Información extra sobre el cliente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="notes">Notas</Label>
              <textarea
                id="notes"
                rows={4}
                value={formData.notes}
                onChange={(e) => updateFormData('notes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Observaciones, preferencias, historial, etc."
                disabled={loading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" asChild disabled={loading}>
            <Link href="/dashboard/clients">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Crear Cliente
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
