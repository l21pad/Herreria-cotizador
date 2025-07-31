'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Clock, CheckCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'

export default function VerifyEmail() {
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const { user, resendVerification } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const email = searchParams.get('email') || user?.email || ''

  useEffect(() => {
    // If user is already verified, redirect to onboarding
    if (user?.email_confirmed_at) {
      router.push('/onboarding')
      return
    }

    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [user, router])

  const handleResendEmail = async () => {
    if (!email) {
      toast.error('No se encontró el email')
      return
    }

    setIsResending(true)
    
    try {
      const { error } = await resendVerification(email)
      
      if (error) {
        toast.error('Error al reenviar el email: ' + error.message)
      } else {
        toast.success('Email de verificación reenviado correctamente')
        setCanResend(false)
        setCountdown(60)
      }
    } catch (error) {
      toast.error('Error al reenviar el email')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Mail className="h-16 w-16 text-blue-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Verifica tu Email
          </CardTitle>
          <CardDescription>
            Te hemos enviado un enlace de verificación
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-700 text-sm">
              <strong>Email enviado a:</strong> {email}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Instrucciones:
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>1. Revisa tu bandeja de entrada</li>
              <li>2. Busca el email de "Cotizador Herrería PRO"</li>
              <li>3. Haz clic en el enlace de verificación</li>
              <li>4. Serás redirigido automáticamente</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-700 text-xs">
              <strong>¿No ves el email?</strong> Revisa tu carpeta de spam o promociones.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3">
          <Button 
            onClick={handleResendEmail}
            disabled={!canResend || isResending}
            className="w-full"
            variant={canResend ? "default" : "outline"}
          >
            {isResending ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Reenviando...
              </>
            ) : canResend ? (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Reenviar Email
              </>
            ) : (
              <>
                <Clock className="mr-2 h-4 w-4" />
                Reenviar en {countdown}s
              </>
            )}
          </Button>
          
          <Button variant="ghost" onClick={() => router.push('/auth/login')} className="w-full">
            Volver al Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
