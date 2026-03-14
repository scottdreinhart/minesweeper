import { Component, type ErrorInfo, type ReactNode } from 'react'
import { clearCrashLogs, clearFatalCrash, getCrashLogs, getFatalCrash, logCrash, markFatalCrash } from '@/app/crashLogger'

const IS_DEBUG_BUILD = import.meta.env.DEV

interface Props {
  children: ReactNode
}
interface State {
  error: Error | null
  fatalMessage: string | null
  showDebugLogs: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, fatalMessage: getFatalCrash()?.message ?? null, showDebugLogs: false }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    markFatalCrash(error)
    logCrash('ErrorBoundary', error, info)
    this.setState({ fatalMessage: error.message })
  }

  private onClearCrashState = () => {
    clearFatalCrash()
    this.setState({ error: null, fatalMessage: null })
  }

  private onReload = () => {
    window.location.reload()
  }

  private onToggleDebugLogs = () => {
    this.setState((prev) => ({ ...prev, showDebugLogs: !prev.showDebugLogs }))
  }

  private onClearDebugLogs = () => {
    clearCrashLogs()
    this.forceUpdate()
  }

  render() {
    if (this.state.error || this.state.fatalMessage) {
      const message = this.state.error?.message ?? this.state.fatalMessage ?? 'Unknown fatal crash'
      const logs = IS_DEBUG_BUILD ? getCrashLogs().slice(0, 10) : []
      return (
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            color: 'var(--text, #fff)',
            background: 'var(--bg, #1a1a2e)',
          }}
        >
          <h1>Something went wrong</h1>
          <p>{message}</p>
          <p style={{ marginTop: '0.5rem', opacity: 0.8 }}>Crash logged locally. Use reload after the fix lands.</p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            <button onClick={this.onReload} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
              Reload App
            </button>
            <button onClick={this.onClearCrashState} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
              Clear Crash State
            </button>
          </div>
          {IS_DEBUG_BUILD ? (
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <button onClick={this.onToggleDebugLogs} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
                  {this.state.showDebugLogs ? 'Hide Crash Logs' : 'Show Crash Logs'}
                </button>
                <button onClick={this.onClearDebugLogs} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
                  Clear Crash Logs
                </button>
              </div>
              {this.state.showDebugLogs ? (
                <pre
                  style={{
                    marginTop: '0.75rem',
                    textAlign: 'left',
                    maxHeight: '16rem',
                    overflow: 'auto',
                    padding: '0.75rem',
                    border: '1px solid rgba(255,255,255,0.25)',
                    borderRadius: '0.5rem',
                    background: 'rgba(0,0,0,0.35)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {logs.length > 0
                    ? logs
                        .map((log) => {
                          const when = new Date(log.timestamp).toLocaleString()
                          return `[${when}] ${log.area}: ${log.message}${log.details ? `\n${log.details}` : ''}`
                        })
                        .join('\n\n')
                    : 'No crash logs recorded.'}
                </pre>
              ) : null}
            </div>
          ) : null}
        </div>
      )
    }
    return this.props.children
  }
}
