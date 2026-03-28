'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Loader2 } from 'lucide-react'

export default function DepositPage() {
  const router = useRouter()
  const [denied, setDenied] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me').then((res) => {
      if (res.ok) router.replace('/deposit/portal')
      else setDenied(true)
    })
  }, [])

  if (denied) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <div className="card max-w-sm w-full p-8 text-center space-y-5">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
            <AlertTriangle size={22} className="text-red-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Access Denied</h1>
            <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
              Please return to HabeshaUnlocker and use the link provided.
            </p>
          </div>
          <a
            href={process.env.NEXT_PUBLIC_PARENT_APP_URL ?? '#'}
            className="btn-secondary w-full block text-center"
          >
            ← Back to HabeshaUnlocker
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <Loader2 size={24} className="text-blue-400 animate-spin" />
    </div>
  )
}