import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { loginSchema, type LoginFormValues } from '@/schemas/auth.schema'
import { authApi } from '@/api/auth.api'
import { useAuthStore } from '@/stores/authStore'
import { MOCK_USERS } from '@/mocks/mockAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/_auth/login')({
  component: LoginPage,
})

const IS_MOCK = import.meta.env.VITE_MOCK_AUTH === 'true'

function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const { token, user } = await authApi.login(values)
      login(token, user)
      navigate({ to: '/board' })
    } catch {
      toast.error('Credenciales inválidas')
    }
  }

  const quickLogin = (email: string) => {
    setValue('email', email)
    setValue('password', 'password')
    handleSubmit(onSubmit)()
  }

  return (
    <Card className="w-full max-w-sm shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold tracking-tight">Mini Jira</CardTitle>
        <CardDescription>Ingresa tus credenciales para continuar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="usuario@minijira.io"
              autoComplete="email"
              {...register('email')}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password')}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            {errors.password && (
              <p id="password-error" className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>
        </form>

        {IS_MOCK && (
          <div className="space-y-2 border-t pt-4">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Badge variant="outline" className="text-[10px] px-1 py-0">MOCK</Badge>
              Acceso rápido — contraseña: <code className="font-mono">password</code>
            </p>
            <div className="flex flex-col gap-1.5">
              {MOCK_USERS.map((u) => (
                <Button
                  key={u.email}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="justify-start text-xs"
                  onClick={() => quickLogin(u.email)}
                >
                  {u.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
