'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checking, setChecking] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const [supabase] = useState(createClient)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          router.replace('/dashboard')
          return
        }
      } catch (authError) {
        console.error('Error checking auth:', authError)
      } finally {
        setChecking(false)
      }
    }

    checkAuth()
  }, [supabase, router])

  useEffect(() => {
    const forms = document.querySelectorAll('form')
    forms.forEach((form) => form.setAttribute('autocomplete', 'off'))

    const inputs = document.querySelectorAll('input[type="password"], input[type="email"]')
    inputs.forEach((input) => {
      input.setAttribute('autocomplete', 'off')
      input.setAttribute('data-lpignore', 'true')
    })

    const handleBeforeUnload = () => reset()
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [reset])

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    setError(null)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password })

      if (signInError) {
        setError(signInError.message)
        return
      }

      reset()
      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <main className="auth-shell">
        <div className="auth-status-card" role="status" aria-live="polite">
          <span className="auth-spinner" aria-hidden="true" />
          <p className="mt-5 text-base font-semibold text-white">Preparing your account</p>
          <p className="mt-1 text-sm text-slate-400">This will only take a moment.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="auth-shell">
      <div className="auth-glow auth-glow-left" aria-hidden="true" />
      <div className="auth-glow auth-glow-right" aria-hidden="true" />

      {loading ? (
        <div className="auth-overlay" role="status" aria-live="polite">
          <div className="auth-status-card">
            <span className="auth-spinner" aria-hidden="true" />
            <p className="mt-5 text-base font-semibold text-white">Signing you in</p>
            <p className="mt-1 text-sm text-slate-400">Verifying your credentials…</p>
          </div>
        </div>
      ) : null}

      <section className="auth-card auth-card-login" aria-labelledby="login-heading">
        <Link href="/" className="auth-back-link"><ArrowLeft aria-hidden="true" size={17} />Back</Link>

        <div className="auth-brand-mark auth-brand-mark-small">
          <Image src="/icons/friendyouthlogo.png" alt="Friendz Youth Association" width={88} height={88} className="h-full w-full object-cover" priority />
        </div>

        <div className="text-center">
          <p className="auth-eyebrow">Administrator access</p>
          <h1 id="login-heading" className="auth-title mt-2.5">Welcome back</h1>
          <p className="auth-description mt-2">Sign in to manage the community dashboard.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-5" autoComplete="off" noValidate>
          <div>
            <label htmlFor="email" className="auth-label">Email address</label>
            <div className="auth-input-wrap">
              <Mail className="auth-input-icon" aria-hidden="true" size={18} />
              <input {...register('email')} type="email" id="email" autoComplete="off" autoCapitalize="none" spellCheck={false} data-lpignore="true" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} className="auth-input" placeholder="name@example.com" />
            </div>
            {errors.email ? <p id="email-error" className="auth-field-error" role="alert">{errors.email.message}</p> : null}
          </div>

          <div>
            <label htmlFor="password" className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <LockKeyhole className="auth-input-icon" aria-hidden="true" size={18} />
              <input {...register('password')} type={showPassword ? 'text' : 'password'} id="password" autoComplete="new-password" data-lpignore="true" aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'password-error' : undefined} className="auth-input auth-input-password" placeholder="Enter your password" />
              <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="auth-password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff aria-hidden="true" size={19} /> : <Eye aria-hidden="true" size={19} />}
              </button>
            </div>
            {errors.password ? <p id="password-error" className="auth-field-error" role="alert">{errors.password.message}</p> : null}
          </div>

          {error ? (
            <div className="auth-alert" role="alert"><AlertCircle className="mt-0.5 shrink-0" aria-hidden="true" size={18} /><p>{error}</p></div>
          ) : null}

          <button type="submit" disabled={loading} className="auth-button auth-button-primary group">
            <span>Sign in securely</span>
            <ArrowRight aria-hidden="true" size={19} className="transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </form>

        <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
          <ShieldCheck aria-hidden="true" size={15} className="text-emerald-400" />Secure administrator access
        </p>
      </section>
    </main>
  )
}
