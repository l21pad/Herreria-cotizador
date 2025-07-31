'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Package, 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2,
  Save,
  X,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface Material {
  id: string;
  name: string;
  unit: string;
  price: number;
  stock?: number;
  min_stock?: number;
  category?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export default function MaterialsPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    price: 0,
    stock: 0,
    min_stock: 0,
    category: '',
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile?.id) {
      fetchMaterials();
    }
  }, [profile]);

  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('profile_id', profile!.id)
        .order('name');

      if (error) {
        console.error('Error fetching materials:', error);
        toast.error('Error al cargar los materiales');
        return;
      }

      setMaterials(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado al cargar los materiales');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      unit: '',
      price: 0,
      stock: 0,
      min_stock: 0,
      category: '',
      description: ''
    });
    setErrors({});
    setEditingMaterial(null);
    setShowAddForm(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.unit.trim()) {
      newErrors.unit = 'La unidad es requerida';
    }

    if (formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
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

    try {
      const materialData = {
        profile_id: profile!.id,
        name: formData.name.trim(),
        unit: formData.unit.trim(),
        price: formData.price,
        stock: formData.stock || null,
        min_stock: formData.min_stock || null,
        category: formData.category.trim() || null,
        description: formData.description.trim() || null
      };

      if (editingMaterial) {
        const { error } = await supabase
          .from('materials')
          .update(materialData)
          .eq('id', editingMaterial.id);

        if (error) {
          console.error('Error updating material:', error);
          toast.error('Error al actualizar el material');
          return;
        }

        toast.success('Material actualizado exitosamente');
      } else {
        const { error } = await supabase
          .from('materials')
          .insert(materialData);

        if (error) {
          console.error('Error creating material:', error);
          toast.error('Error al crear el material');
          return;
        }

        toast.success('Material creado exitosamente');
      }

      resetForm();
      fetchMaterials();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado');
    }
  };

  const handleEdit = (material: Material) => {
    setFormData({
      name: material.name,
      unit: material.unit,
      price: material.price,
      stock: material.stock || 0,
      min_stock: material.min_stock || 0,
      category: material.category || '',
      description: material.description || ''
    });
    setEditingMaterial(material);
    setShowAddForm(true);
  };

  const handleDelete = async (materialId: string) => {
    if (!confirm('¿Estás seguro de eliminar este material? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', materialId);

      if (error) {
        toast.error('Error al eliminar el material');
        return;
      }

      toast.success('Material eliminado exitosamente');
      fetchMaterials();
    } catch (error) {
      toast.error('Error inesperado al eliminar el material');
    }
  };

  const filteredMaterials = materials.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Package className="h-8 w-8 mr-3 text-blue-600" />
            Materiales
          </h1>
          <p className="text-gray-600 mt-1">
            Gestiona tu catálogo de materiales y precios
          </p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="mt-4 sm:mt-0"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Nuevo Material
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {editingMaterial ? 'Editar Material' : 'Nuevo Material'}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Varilla 3/8, Tubo cuadrado, etc."
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
                  <Label htmlFor="unit">Unidad *</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="kg, m, pza, m²"
                    className={errors.unit ? 'border-red-500' : ''}
                  />
                  {errors.unit && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.unit}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="price">Precio *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className={errors.price ? 'border-red-500' : ''}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.price}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="category">Categoría</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Varillas, Tubos, Soldadura, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="stock">Stock actual</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <Label htmlFor="min_stock">Stock mínimo</Label>
                  <Input
                    id="min_stock"
                    type="number"
                    min="0"
                    value={formData.min_stock}
                    onChange={(e) => setFormData({ ...formData, min_stock: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <textarea
                  id="description"
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Especificaciones técnicas, marca, etc."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingMaterial ? 'Actualizar' : 'Crear'} Material
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar materiales por nombre o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando materiales...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredMaterials.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {materials.length === 0 ? 'No tienes materiales aún' : 'No se encontraron materiales'}
            </h3>
            <p className="text-gray-600 mb-6">
              {materials.length === 0 
                ? 'Agrega materiales para poder incluirlos en tus cotizaciones'
                : 'Intenta ajustar el término de búsqueda'
              }
            </p>
            {materials.length === 0 && (
              <Button onClick={() => setShowAddForm(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Agregar Primer Material
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Materials Table */}
      {!loading && filteredMaterials.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Material</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Categoría</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Unidad</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Precio</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Stock</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMaterials.map((material) => (
                    <tr key={material.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{material.name}</div>
                          {material.description && (
                            <div className="text-sm text-gray-500">{material.description}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {material.category || '-'}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {material.unit}
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        ${material.price.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {material.stock !== null && material.stock !== undefined ? (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            material.min_stock && material.stock <= material.min_stock
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {material.stock} {material.unit}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(material)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(material.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
