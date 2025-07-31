'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ESTADOS_MEXICO = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 
  'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima', 'Durango', 'Estado de México', 
  'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'Michoacán', 'Morelos', 'Nayarit', 
  'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 
  'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'
];

const REGIMENES_FISCALES = [
  'Régimen General de Ley Personas Morales',
  'Régimen de Incorporación Fiscal',
  'Régimen de Personas Físicas con Actividades Empresariales',
  'Régimen de Pequeños Contribuyentes',
  'Régimen Intermedio de las Personas Físicas'
];

export default function OnboardingPage() {
  const { user, profile, createProfile, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    business_name: '',
    address: '',
    state: '',
    rfc: '',
    phone: '',
    email: user?.email || '',
    fiscal_regime: '',
    cfdi_use: 'G03',
    payment_method: 'PUE'
  });
  const [formLoading, setFormLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
    
    if (!loading && profile) {
      router.push('/dashboard');
    }
  }, [user, profile, loading, router]);

  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({ ...prev, email: user.email || '' }));
    }
  }, [user]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.business_name.trim()) {
      newErrors.business_name = 'El nombre de la herrería es requerido';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    }

    if (!formData.state) {
      newErrors.state = 'El estado es requerido';
    }

    if (!formData.rfc.trim()) {
      newErrors.rfc = 'El RFC es requerido';
    } else if (!/^[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{3}$/.test(formData.rfc.toUpperCase())) {
      newErrors.rfc = 'Formato de RFC inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }

    if (!formData.fiscal_regime) {
      newErrors.fiscal_regime = 'El régimen fiscal es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setFormLoading(true);

    try {
      const profileData = {
        user_id: user!.id,
        business_name: formData.business_name.trim(),
        address: formData.address.trim(),
        state: formData.state,
        rfc: formData.rfc.toUpperCase().trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        fiscal_regime: formData.fiscal_regime,
        cfdi_use: formData.cfdi_use,
        payment_method: formData.payment_method,
        is_pro: false,
        pro_expires_at: undefined
      };

      const { error } = await createProfile(profileData);
      
      if (error) {
        toast.error('Error al crear el perfil. Inténtalo de nuevo.');
        console.error('Profile creation error:', error);
        return;
      }

      toast.success('¡Perfil creado exitosamente!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Error inesperado. Inténtalo de nuevo.');
      console.error('Unexpected error:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Calculator className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Bienvenido a Herrería PRO!
          </h1>
          <p className="text-gray-600">
            Configura tu perfil de herrería para comenzar a cotizar
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información de tu Herrería</CardTitle>
            <CardDescription>
              Esta información se usará en tus cotizaciones y facturación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="business_name">Nombre de la Herrería *</Label>
                  <Input
                    id="business_name"
                    type="text"
                    placeholder="Herrería Los Pinos"
                    value={formData.business_name}
                    onChange={(e) => updateFormData('business_name', e.target.value)}
                    disabled={formLoading}
                    className={errors.business_name ? 'border-red-500' : ''}
                  />
                  {errors.business_name && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.business_name}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="address">Dirección Completa *</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Calle, Número, Colonia, Ciudad"
                    value={formData.address}
                    onChange={(e) => updateFormData('address', e.target.value)}
                    disabled={formLoading}
                    className={errors.address ? 'border-red-500' : ''}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="state">Estado *</Label>
                  <select
                    id="state"
                    value={formData.state}
                    onChange={(e) => updateFormData('state', e.target.value)}
                    disabled={formLoading}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecciona un estado</option>
                    {ESTADOS_MEXICO.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.state}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="rfc">RFC *</Label>
                  <Input
                    id="rfc"
                    type="text"
                    placeholder="ABC123456XYZ"
                    value={formData.rfc}
                    onChange={(e) => updateFormData('rfc', e.target.value.toUpperCase())}
                    disabled={formLoading}
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
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="55 1234 5678"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    disabled={formLoading}
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled={true}
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Este correo se usará para el sistema
                  </p>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="fiscal_regime">Régimen Fiscal *</Label>
                  <select
                    id="fiscal_regime"
                    value={formData.fiscal_regime}
                    onChange={(e) => updateFormData('fiscal_regime', e.target.value)}
                    disabled={formLoading}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.fiscal_regime ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecciona tu régimen fiscal</option>
                    {REGIMENES_FISCALES.map((regimen) => (
                      <option key={regimen} value={regimen}>
                        {regimen}
                      </option>
                    ))}
                  </select>
                  {errors.fiscal_regime && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.fiscal_regime}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <h4 className="font-medium text-blue-900">Información fiscal</h4>
                    <p className="text-sm text-blue-700">
                      Esta información se usará para generar facturas y cotizaciones 
                      conforme a la normatividad fiscal mexicana.
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={formLoading}
              >
                {formLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando perfil...
                  </div>
                ) : (
                  'Completar Configuración'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
