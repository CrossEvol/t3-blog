'use client' // this registers <Editor> as a Client Component
import type { IResult } from '@/common/result'
import { env } from '@/env'
import { useEditorStorage } from '@/hooks/useEditorStorage'
import '@blocknote/core/fonts/inter.css'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import {
  BlockColorsItem,
  DragHandleMenu,
  RemoveBlockItem,
  SideMenu,
  SideMenuController,
  useCreateBlockNote,
} from '@blocknote/react'
import React from 'react'
import { ExportItem } from './export-item'
import { ImportItem } from './import-item'

type TmpFilesResponse = {
  status: string
  data: TmpFilesData
}

type TmpFilesData = {
  url: string
}

// Uploads a file to tmpfiles.org and returns the URL to the uploaded file.
export async function uploadFileToTmpfiles(file: File) {
  const body = new FormData()
  body.append('file', file)

  const ret = await fetch('https://tmpfiles.org/api/v1/upload', {
    method: 'POST',
    body: body,
  })
  return ((await ret.json()) as TmpFilesResponse).data.url.replace(
    'tmpfiles.org/',
    'tmpfiles.org/dl/',
  )
}

// Uploads a file to tmpfiles.org and returns the URL to the uploaded file.
async function uploadFile(file: File) {
  const body = new FormData()
  body.append('file', file)

  const response = await fetch(`${env.NEXT_PUBLIC_UPLOAD_URL}/api/upload`, {
    method: 'POST',
    body: body,
  })

  const result = (await response.json()) as IResult<string>
  if (result.status === 200) {
    return result.data
  } else {
    throw new Error(result.message)
  }
}

interface IProps {
  postId: number
  content: string
  setContent: (content: string) => void
}

const InnerRichTextEditor = ({ postId, content, setContent }: IProps) => {
  const { saveContent } = useEditorStorage()

  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: 'paragraph',
        content: '...',
      },
    ],
    uploadFile,
  })

  // For initialization; on mount, convert the initial Markdown to blocks and replace the default editor's content
  // here must not put the content in useEffect dependency array
  React.useEffect(() => {
    async function loadInitialMarkdown() {
      const blocks = await editor.tryParseMarkdownToBlocks(content)
      editor.replaceBlocks(editor.document, blocks)
    }

    loadInitialMarkdown()
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [editor])

  // Renders the editor instance using a React component.
  return (
    <BlockNoteView
      editor={editor}
      sideMenu={false}
      onChange={async () => {
        setContent(await editor.blocksToMarkdownLossy(editor.document))
        await saveContent(`post-${postId}`, editor.document)
      }}
    >
      <SideMenuController
        sideMenu={(props) => (
          <SideMenu
            {...props}
            dragHandleMenu={(props) => (
              <DragHandleMenu {...props}>
                <RemoveBlockItem {...props}>Delete</RemoveBlockItem>
                <BlockColorsItem {...props}>Colors</BlockColorsItem>
                {/* Item which resets the hovered block's type. */}
                <ExportItem {...props} postId={postId} content={content} />
                <ImportItem {...props} />
              </DragHandleMenu>
            )}
          />
        )}
      />
    </BlockNoteView>
  )
}

// Our <Editor> component we can reuse later
const RichTextEditor = React.memo(InnerRichTextEditor)

export default RichTextEditor
