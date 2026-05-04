import MDEditor from '@uiw/react-md-editor'
import { useTheme } from '@/hooks/useTheme'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  readOnly?: boolean
  height?: number
  error?: boolean
}

export function MarkdownEditor({ value, onChange, readOnly = false, height = 200, error = false }: MarkdownEditorProps) {
  const { resolvedTheme } = useTheme()

  if (readOnly) {
    return (
      <div data-color-mode={resolvedTheme} className="rounded-md border overflow-hidden">
        <MDEditor.Markdown
          source={value}
          style={{ padding: '12px 16px', minHeight: 60 }}
        />
      </div>
    )
  }

  return (
    <div
      data-color-mode={resolvedTheme}
      className={error ? 'rounded-md ring-2 ring-destructive' : ''}
    >
      <MDEditor
        value={value}
        onChange={(v) => onChange(v ?? '')}
        height={height}
        preview="edit"
        hideToolbar={false}
        data-testid="md-editor"
      />
    </div>
  )
}
