'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calculator, 
  Plus, 
  Trash2, 
  Users, 
  Save,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface Client {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}

interface Job {
  id: string;
  type: string;
  description: string;
  width?: number;
  height?: number;
  depth?: number;
  quantity: number;
  labor_cost: number;
  additional_costs: number;
  materials: JobMaterial[];
}

interface JobMaterial {
  id: string;
  material_id: string;
  material_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Material {
  id: string;
  name: string;
  unit: string;
  price: number;
}

export default function NewQuotePage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  
  const [formData, setFormData] = useState({
    client_id: '',
    valid_until: '',
    discount_percentage: 0,
    profit_percentage: 30,
    advance_payment: 0,
    notes: '',
    requires_invoice: false
  });

  const [jobs, setJobs] = useState<Job[]>([
    {
      id: '1',
      type: 'Portón',
      description: '',
      width: 0,
      height: 0,
      depth: 0,
      quantity: 1,
      labor_cost: 0,
      additional_costs: 0,
      materials: []
    }
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile?.id) {
      fetchClients();
      fetchMaterials();
    }
  }, [profile]);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, phone, email')
        .eq('profile_id', profile!.id)
        .order('name');

      if (error) {
        console.error('Error fetching clients:', error);
        return;
      }

      setClients(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('id, name, unit, price')
        .eq('profile_id', profile!.id)
        .order('name');

      if (error) {
        console.error('Error fetching materials:', error);
        return;
      }

      setMaterials(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addJob = () => {
    const newJob: Job = {
      id: Date.now().toString(),
      type: 'Trabajo',
      description: '',
      width: 0,
      height: 0,
      depth: 0,
      quantity: 1,
      labor_cost: 0,
      additional_costs: 0,
      materials: []
    };
    setJobs([...jobs, newJob]);
  };

  const removeJob = (jobId: string) => {
    if (jobs.length > 1) {
      setJobs(jobs.filter(job => job.id !== jobId));
    }
  };

  const updateJob = (jobId: string, updates: Partial<Job>) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, ...updates } : job
    ));
  };

  const addMaterialToJob = (jobId: string) => {
    const newMaterial: JobMaterial = {
      id: Date.now().toString(),
      material_id: '',
      material_name: '',
      quantity: 1,
      unit_price: 0,
      total_price: 0
    };

    updateJob(jobId, {
      materials: [...jobs.find(j => j.id === jobId)!.materials, newMaterial]
    });
  };

  const removeMaterialFromJob = (jobId: string, materialId: string) => {
    const job = jobs.find(j => j.id === jobId)!;
    updateJob(jobId, {
      materials: job.materials.filter(m => m.id !== materialId)
    });
  };

  const updateJobMaterial = (jobId: string, materialId: string, updates: Partial<JobMaterial>) => {
    const job = jobs.find(j => j.id === jobId)!;
    const updatedMaterials = job.materials.map(m =>
      m.id === materialId ? { ...m, ...updates } : m
    );

    // Recalculate total price if quantity or unit_price changed
    if ('quantity' in updates || 'unit_price' in updates) {
      const material = updatedMaterials.find(m => m.id === materialId)!;
      material.total_price = material.quantity * material.unit_price;
    }

    updateJob(jobId, { materials: updatedMaterials });
  };

  const selectMaterial = (jobId: string, materialId: string, selectedMaterialId: string) => {
    const selectedMaterial = materials.find(m => m.id === selectedMaterialId);
    if (selectedMaterial) {
      updateJobMaterial(jobId, materialId, {
        material_id: selectedMaterialId,
        material_name: selectedMaterial.name,
        unit_price: selectedMaterial.price,
        total_price: jobs.find(j => j.id === jobId)!.materials.find(m => m.id === materialId)!.quantity * selectedMaterial.price
      });
    }
  };

  const calculateJobTotal = (job: Job) => {
    const materialsTotal = job.materials.reduce((sum, m) => sum + m.total_price, 0);
    return materialsTotal + job.labor_cost + job.additional_costs;
  };

  const calculateSubtotal = () => {
    return jobs.reduce((sum, job) => sum + calculateJobTotal(job), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = subtotal * (formData.discount_percentage / 100);
    const afterDiscount = subtotal - discountAmount;
    const profitAmount = afterDiscount * (formData.profit_percentage / 100);
    const total = afterDiscount + profitAmount;
    const tax = total * 0.16; // IVA 16%
    return total + tax;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.client_id) {
      newErrors.client_id = 'Selecciona un cliente';
    }

    if (!formData.valid_until) {
      newErrors.valid_until = 'La fecha de validez es requerida';
    } else {
      const validUntil = new Date(formData.valid_until);
      const today = new Date();
      if (validUntil <= today) {
        newErrors.valid_until = 'La fecha debe ser posterior a hoy';
      }
    }

    if (jobs.length === 0) {
      newErrors.jobs = 'Agrega al menos un trabajo';
    }

    jobs.forEach((job, index) => {
      if (!job.description.trim()) {
        newErrors[`job_${index}_description`] = 'La descripción del trabajo es requerida';
      }
    });

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
      // Generate quote number
      const quoteNumber = `COT-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      const subtotal = calculateSubtotal();
      const discountAmount = subtotal * (formData.discount_percentage / 100);
      const afterDiscount = subtotal - discountAmount;
      const profitAmount = afterDiscount * (formData.profit_percentage / 100);
      const beforeTax = afterDiscount + profitAmount;
      const taxAmount = beforeTax * 0.16;
      const total = beforeTax + taxAmount;

      // Create quote
      const { data: quote, error: quoteError } = await supabase
        .from('quotes')
        .insert({
          profile_id: profile!.id,
          client_id: formData.client_id,
          quote_number: quoteNumber,
          status: 'draft',
          requires_invoice: formData.requires_invoice,
          subtotal: subtotal,
          tax_amount: taxAmount,
          total: total,
          advance_payment: formData.advance_payment,
          remaining_payment: total - formData.advance_payment,
          discount_percentage: formData.discount_percentage,
          discount_amount: discountAmount,
          profit_percentage: formData.profit_percentage,
          notes: formData.notes,
          valid_until: formData.valid_until
        })
        .select()
        .single();

      if (quoteError) {
        console.error('Error creating quote:', quoteError);
        toast.error('Error al crear la cotización');
        return;
      }

      // Create jobs
      for (const job of jobs) {
        const { data: createdJob, error: jobError } = await supabase
          .from('jobs')
          .insert({
            quote_id: quote.id,
            type: job.type,
            description: job.description,
            width: job.width || null,
            height: job.height || null,
            depth: job.depth || null,
            quantity: job.quantity,
            labor_cost: job.labor_cost,
            additional_costs: job.additional_costs
          })
          .select()
          .single();

        if (jobError) {
          console.error('Error creating job:', jobError);
          continue;
        }

        // Create job materials
        for (const material of job.materials) {
          if (material.material_id) {
            await supabase
              .from('job_materials')
              .insert({
                job_id: createdJob.id,
                material_id: material.material_id,
                quantity: material.quantity,
                unit_price: material.unit_price,
                total_price: material.total_price
              });
          }
        }
      }

      toast.success('Cotización creada exitosamente');
      router.push('/dashboard/quotes');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado al crear la cotización');
    } finally {
      setLoading(false);
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
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center mb-2">
            <Button variant="ghost" asChild className="mr-4">
              <Link href="/dashboard/quotes">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Calculator className="h-8 w-8 mr-3 text-blue-600" />
              Nueva Cotización
            </h1>
          </div>
          <p className="text-gray-600">
            Crea una cotización detallada para tu cliente
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
            <CardDescription>
              Datos generales de la cotización
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client_id">Cliente *</Label>
                <select
                  id="client_id"
                  value={formData.client_id}
                  onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.client_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
                >
                  <option value="">Selecciona un cliente</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
                {clients.length === 0 && (
                  <p className="text-sm text-blue-600 mt-1">
                    <Link href="/dashboard/clients/new" className="underline">
                      Crear un cliente primero
                    </Link>
                  </p>
                )}
                {errors.client_id && (
                  <p className="text-sm text-red-600 flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.client_id}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="valid_until">Válida hasta *</Label>
                <Input
                  id="valid_until"
                  type="date"
                  value={formData.valid_until}
                  onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className={errors.valid_until ? 'border-red-500' : ''}
                  disabled={loading}
                />
                {errors.valid_until && (
                  <p className="text-sm text-red-600 flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.valid_until}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="discount_percentage">Descuento (%)</Label>
                <Input
                  id="discount_percentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData({ ...formData, discount_percentage: parseFloat(e.target.value) || 0 })}
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="profit_percentage">Margen de ganancia (%)</Label>
                <Input
                  id="profit_percentage"
                  type="number"
                  min="0"
                  max="200"
                  step="0.1"
                  value={formData.profit_percentage}
                  onChange={(e) => setFormData({ ...formData, profit_percentage: parseFloat(e.target.value) || 0 })}
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="advance_payment">Anticipo ($)</Label>
                <Input
                  id="advance_payment"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.advance_payment}
                  onChange={(e) => setFormData({ ...formData, advance_payment: parseFloat(e.target.value) || 0 })}
                  disabled={loading}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="requires_invoice"
                  checked={formData.requires_invoice}
                  onChange={(e) => setFormData({ ...formData, requires_invoice: e.target.checked })}
                  disabled={loading}
                />
                <Label htmlFor="requires_invoice">Requiere factura</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notas adicionales</Label>
              <textarea
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Condiciones especiales, observaciones, etc."
                disabled={loading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Jobs Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Trabajos</CardTitle>
                <CardDescription>
                  Define los trabajos que incluye esta cotización
                </CardDescription>
              </div>
              <Button type="button" onClick={addJob} variant="outline" disabled={loading}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Trabajo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {jobs.map((job, jobIndex) => (
              <Card key={job.id} className="border-2 border-dashed border-gray-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Trabajo #{jobIndex + 1}</CardTitle>
                    {jobs.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeJob(job.id)}
                        className="text-red-600 hover:text-red-700"
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`job_${job.id}_type`}>Tipo de trabajo</Label>
                      <Input
                        id={`job_${job.id}_type`}
                        value={job.type}
                        onChange={(e) => updateJob(job.id, { type: e.target.value })}
                        placeholder="Ej: Portón, Reja, Ventana"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`job_${job.id}_quantity`}>Cantidad</Label>
                      <Input
                        id={`job_${job.id}_quantity`}
                        type="number"
                        min="1"
                        value={job.quantity}
                        onChange={(e) => updateJob(job.id, { quantity: parseInt(e.target.value) || 1 })}
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`job_${job.id}_width`}>Ancho (m)</Label>
                      <Input
                        id={`job_${job.id}_width`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={job.width || ''}
                        onChange={(e) => updateJob(job.id, { width: parseFloat(e.target.value) || 0 })}
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`job_${job.id}_height`}>Alto (m)</Label>
                      <Input
                        id={`job_${job.id}_height`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={job.height || ''}
                        onChange={(e) => updateJob(job.id, { height: parseFloat(e.target.value) || 0 })}
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`job_${job.id}_labor_cost`}>Costo de mano de obra ($)</Label>
                      <Input
                        id={`job_${job.id}_labor_cost`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={job.labor_cost}
                        onChange={(e) => updateJob(job.id, { labor_cost: parseFloat(e.target.value) || 0 })}
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`job_${job.id}_additional_costs`}>Costos adicionales ($)</Label>
                      <Input
                        id={`job_${job.id}_additional_costs`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={job.additional_costs}
                        onChange={(e) => updateJob(job.id, { additional_costs: parseFloat(e.target.value) || 0 })}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`job_${job.id}_description`}>Descripción *</Label>
                    <textarea
                      id={`job_${job.id}_description`}
                      rows={3}
                      value={job.description}
                      onChange={(e) => updateJob(job.id, { description: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors[`job_${jobIndex}_description`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Describe detalladamente el trabajo a realizar..."
                      disabled={loading}
                    />
                    {errors[`job_${jobIndex}_description`] && (
                      <p className="text-sm text-red-600 flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors[`job_${jobIndex}_description`]}
                      </p>
                    )}
                  </div>

                  {/* Materials */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label>Materiales</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addMaterialToJob(job.id)}
                        disabled={loading}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Material
                      </Button>
                    </div>

                    {job.materials.map((material) => (
                      <div key={material.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end mb-2 p-3 bg-gray-50 rounded-lg">
                        <div>
                          <Label>Material</Label>
                          <select
                            value={material.material_id}
                            onChange={(e) => selectMaterial(job.id, material.id, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                          >
                            <option value="">Seleccionar material</option>
                            {materials.map((mat) => (
                              <option key={mat.id} value={mat.id}>
                                {mat.name} - ${mat.price}/{mat.unit}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <Label>Cantidad</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={material.quantity}
                            onChange={(e) => updateJobMaterial(job.id, material.id, { quantity: parseFloat(e.target.value) || 0 })}
                            disabled={loading}
                          />
                        </div>

                        <div>
                          <Label>Precio unitario</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={material.unit_price}
                            onChange={(e) => updateJobMaterial(job.id, material.id, { unit_price: parseFloat(e.target.value) || 0 })}
                            disabled={loading}
                          />
                        </div>

                        <div>
                          <Label>Total</Label>
                          <Input
                            type="number"
                            value={material.total_price}
                            disabled
                            className="bg-gray-100"
                          />
                        </div>

                        <div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeMaterialFromJob(job.id, material.id)}
                            className="text-red-600 hover:text-red-700"
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {materials.length === 0 && (
                      <p className="text-sm text-blue-600">
                        <Link href="/dashboard/materials" className="underline">
                          Crear materiales primero
                        </Link>
                      </p>
                    )}
                  </div>

                  {/* Job Total */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-right">
                      <span className="text-lg font-semibold text-blue-900">
                        Subtotal trabajo: ${calculateJobTotal(job).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Quote Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Cotización</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${calculateSubtotal().toLocaleString()}</span>
              </div>
              {formData.discount_percentage > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Descuento ({formData.discount_percentage}%):</span>
                  <span>-${(calculateSubtotal() * formData.discount_percentage / 100).toLocaleString()}</span>
                </div>
              )}
              {formData.profit_percentage > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Margen de ganancia ({formData.profit_percentage}%):</span>
                  <span>+${((calculateSubtotal() - (calculateSubtotal() * formData.discount_percentage / 100)) * formData.profit_percentage / 100).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>IVA (16%):</span>
                <span>${(((calculateSubtotal() - (calculateSubtotal() * formData.discount_percentage / 100)) * (1 + formData.profit_percentage / 100)) * 0.16).toLocaleString()}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span>${calculateTotal().toLocaleString()}</span>
                </div>
              </div>
              {formData.advance_payment > 0 && (
                <div className="flex justify-between text-blue-600">
                  <span>Anticipo:</span>
                  <span>${formData.advance_payment.toLocaleString()}</span>
                </div>
              )}
              {formData.advance_payment > 0 && (
                <div className="flex justify-between text-blue-600">
                  <span>Saldo pendiente:</span>
                  <span>${(calculateTotal() - formData.advance_payment).toLocaleString()}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" asChild disabled={loading}>
            <Link href="/dashboard/quotes">Cancelar</Link>
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
                Crear Cotización
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
