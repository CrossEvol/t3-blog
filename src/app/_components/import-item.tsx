import {
  DragHandleMenuProps,
  useBlockNoteEditor,
  useComponentsContext,
} from '@blocknote/react'

export function ImportItem(_props: DragHandleMenuProps) {
  const editor = useBlockNoteEditor()

  const Components = useComponentsContext()!

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.md,.html,.htm,.markdown'
    input.onchange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (file && file.size <= 2 * 1024 * 1024) {
        // Limit file size to 2MB
        const fileExtension = file.name.split('.').pop()?.toLowerCase() ?? ''
        if (['md', 'html', 'htm', 'markdown'].includes(fileExtension)) {
          const reader = new FileReader()
          reader.onload = async (e) => {
            if (e.target !== null && e.target.result !== null) {
              editor.insertBlocks(
                await editor.tryParseMarkdownToBlocks(
                  e.target.result as string,
                ),
                editor.document[editor.document.length - 1]?.id as string,
                'after',
              )
            }
          }
          reader.readAsText(file)
        } else {
          console.error('Invalid file type')
        }
      } else {
        console.error('File is too large or not selected')
      }
    }
    input.click()
  }

  return (
    <Components.Generic.Menu.Item onClick={handleImport}>
      Import
    </Components.Generic.Menu.Item>
  )
}
