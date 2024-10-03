import {
  type DragHandleMenuProps,
  useComponentsContext,
} from '@blocknote/react'

export function ExportItem(
  props: DragHandleMenuProps & { postId: number; content: string },
) {
  // const editor = useBlockNoteEditor()

  const Components = useComponentsContext()!

  const handleExport = () => {
    const dataStr =
      'data:text/plain;charset=utf-8,' + encodeURIComponent(props.content)
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute('href', dataStr)
    downloadAnchorNode.setAttribute('download', `${props.postId}.md`)
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  return (
    <Components.Generic.Menu.Item onClick={handleExport}>
      Export
    </Components.Generic.Menu.Item>
  )
}
