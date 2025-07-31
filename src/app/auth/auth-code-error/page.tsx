'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Mail } from 'lucide-react'
import Link from 'next/link'

export default function AuthCodeError() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Error de Verificación
          </CardTitle>
          <CardDescription>
            No pudimos verificar tu enlace de confirmación
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">
              El enlace de verificación puede haber expirado o ya haber sido usado.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">
              ¿Qué puedes hacer?
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Intenta acceder desde el enlace original en tu email</li>
              <li>• Solicita un nuevo enlace de verificación</li>
              <li>• Verifica que el enlace esté completo</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3">
          <Button asChild className="w-full">
            <Link href="/auth/verify-email">
              <Mail className="mr-2 h-4 w-4" />
              Solicitar Nuevo Enlace
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="w-full">
            <Link href="/auth/login">
              Volver al Login
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
