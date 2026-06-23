import * as React from 'react'

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 4000

type ToastVariant = 'default' | 'destructive' | 'success'

export type ToasterToast = {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
}

type Action =
  | { type: 'ADD_TOAST'; toast: ToasterToast }
  | { type: 'DISMISS_TOAST'; toastId?: string }
  | { type: 'REMOVE_TOAST'; toastId?: string }

interface State {
  toasts: ToasterToast[]
}

let count = 0
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

function addToRemoveQueue(toastId: string, dispatch: React.Dispatch<Action>) {
  if (toastTimeouts.has(toastId)) return
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({ type: 'REMOVE_TOAST', toastId })
  }, TOAST_REMOVE_DELAY)
  toastTimeouts.set(toastId, timeout)
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_TOAST':
      return { toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) }
    case 'DISMISS_TOAST': {
      const { toastId } = action
      if (toastId) {
        addToRemoveQueue(toastId, dispatch)
      } else {
        state.toasts.forEach((t) => addToRemoveQueue(t.id, dispatch))
      }
      return {
        toasts: state.toasts.map((t) =>
          t.id === toastId || !toastId ? { ...t } : t
        ),
      }
    }
    case 'REMOVE_TOAST':
      return {
        toasts: action.toastId ? state.toasts.filter((t) => t.id !== action.toastId) : [],
      }
  }
}

const listeners: Array<(state: State) => void> = []
let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((l) => l(memoryState))
}

type ToastInput = Omit<ToasterToast, 'id'>

function toast(props: ToastInput) {
  const id = genId()
  dispatch({ type: 'ADD_TOAST', toast: { ...props, id } })
  setTimeout(() => dispatch({ type: 'DISMISS_TOAST', toastId: id }), TOAST_REMOVE_DELAY)
  return { id, dismiss: () => dispatch({ type: 'DISMISS_TOAST', toastId: id }) }
}

toast.success = (title: string, description?: string) =>
  toast({ title, description, variant: 'success' })

toast.error = (title: string, description?: string) =>
  toast({ title, description, variant: 'destructive' })

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)
  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const i = listeners.indexOf(setState)
      if (i > -1) listeners.splice(i, 1)
    }
  }, [])
  return { ...state, toast, dismiss: (id?: string) => dispatch({ type: 'DISMISS_TOAST', toastId: id }) }
}

export { useToast, toast }
