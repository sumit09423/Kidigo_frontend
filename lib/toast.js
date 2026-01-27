'use client'

// Simple global toast store + imperative API

let listeners = new Set()
let toasts = []

function notify() {
  for (const listener of listeners) {
    listener(toasts)
  }
}

export function subscribeToToasts(listener) {
  listeners.add(listener)
  // Send current state immediately
  listener(toasts)

  return () => {
    listeners.delete(listener)
  }
}

function addToast(partial) {
  const id = partial.id ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
  const toast = { id, ...partial }
  toasts = [...toasts, toast]
  notify()
  return id
}

function updateToast(id, patch) {
  toasts = toasts.map(t => (t.id === id ? { ...t, ...patch } : t))
  notify()
}

function removeToast(id) {
  toasts = toasts.filter(t => t.id !== id)
  notify()
}

export const toast = {
  /**
   * Show a loading toast and return its id
   */
  loading(message) {
    return addToast({
      type: 'loading',
      message,
    })
  },

  /**
   * Show a success toast. If an id is passed, upgrade an existing toast.
   */
  success(message, id) {
    const toastId = id || addToast({ type: 'success', message })
    updateToast(toastId, { type: 'success', message })
    // Auto-dismiss after a short delay
    setTimeout(() => {
      removeToast(toastId)
    }, 3500)
    return toastId
  },

  /**
   * Show an error toast. If an id is passed, upgrade an existing toast.
   */
  error(message, id) {
    const toastId = id || addToast({ type: 'error', message })
    updateToast(toastId, { type: 'error', message })
    setTimeout(() => {
      removeToast(toastId)
    }, 4000)
    return toastId
  },

  /**
   * Dismiss a toast by id, or all toasts if no id is provided.
   */
  dismiss(id) {
    if (id) {
      removeToast(id)
    } else {
      toasts = []
      notify()
    }
  },
}

