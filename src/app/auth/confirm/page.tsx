'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function ConfirmPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            ¡Email Verificado!
          </CardTitle>
          <CardDescription>
            Tu cuenta ha sido confirmada exitosamente
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 text-sm">
              Tu email ha sido verificado correctamente. Ahora puedes acceder a todas las funciones de la plataforma.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">
              Próximos pasos:
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Completa tu perfil de herrería</li>
              <li>• Configura tus materiales y precios</li>
              <li>• Crea tu primera cotización</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/onboarding">
              Configurar mi Herrería
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
