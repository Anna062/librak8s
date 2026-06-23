import React from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
          <h2 className="text-2xl font-bold text-destructive">Une erreur est survenue</h2>
          <p className="text-muted-foreground max-w-md">{this.state.error?.message}</p>
          <Button onClick={() => window.location.reload()}>Recharger la page</Button>
        </div>
      )
    }
    return this.props.children
  }
}
