'use client'

import { useEffect, useState } from 'react'
import { subscribeToToasts } from '@/lib/toast'

export default function ToastProvider() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const unsubscribe = subscribeToToasts(setToasts)
    return () => unsubscribe()
  }, [])

  if (!toasts.length) return null

  return (
    <div className="fixed top-4 right-4 z-[120] flex flex-col gap-3 max-w-sm w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={[
            'pointer-events-auto rounded-lg shadow-lg px-4 py-3 text-sm flex items-start gap-3 border',
            'animate-in fade-in slide-in-from-top-2 duration-150',
            t.type === 'success' && 'bg-green-50 border-green-200 text-green-800',
            t.type === 'error' && 'bg-red-50 border-red-200 text-red-800',
            t.type === 'loading' && 'bg-slate-50 border-slate-200 text-slate-800',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <span className="mt-0.5 text-base">
            {t.type === 'success' && '✓'}
            {t.type === 'error' && '⚠'}
            {t.type === 'loading' && (
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-[2px] border-slate-400 border-t-transparent" />
            )}
          </span>
          <p className="flex-1 leading-snug">{t.message}</p>
        </div>
      ))}
    </div>
  )
}

