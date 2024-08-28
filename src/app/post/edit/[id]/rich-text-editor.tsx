"use client"; // this registers <Editor> as a Client Component
import { useEditorStorage } from "@/hooks/useEditorStorage";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import React from "react";

type TmpFilesResponse = {
  status: string;
  data: TmpFilesData;
};

type TmpFilesData = {
  url: string;
};

// Uploads a file to tmpfiles.org and returns the URL to the uploaded file.
async function uploadFile(file: File) {
  const body = new FormData();
  body.append("file", file);

  const ret = await fetch("https://tmpfiles.org/api/v1/upload", {
    method: "POST",
    body: body,
  });
  return ((await ret.json()) as TmpFilesResponse).data.url.replace(
    "tmpfiles.org/",
    "tmpfiles.org/dl/",
  );
}

interface IProps {
  postId: number;
  initialMarkdown: string;
  setContent: (content: string) => void;
}

// Our <Editor> component we can reuse later
export default function RichTextEditor({
  postId,
  initialMarkdown,
  setContent,
}: IProps) {
  const { saveContent } = useEditorStorage();

  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "paragraph",
        content: "Welcome to this demo!",
      },
      {
        type: "paragraph",
        content: "Upload an image using the button below",
      },
    ],
    uploadFile,
  });

  // For initialization; on mount, convert the initial Markdown to blocks and replace the default editor's content
  React.useEffect(() => {
    async function loadInitialMarkdown() {
      const blocks = await editor.tryParseMarkdownToBlocks(initialMarkdown);
      editor.replaceBlocks(editor.document, blocks);
    }
    
    loadInitialMarkdown()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [editor, initialMarkdown]);

  // Renders the editor instance using a React component.
  return (
    <BlockNoteView
      editor={editor}
      onChange={async () => {
        setContent(await editor.blocksToMarkdownLossy(editor.document));
        await saveContent(`post-${postId}`, editor.document);
      }}
    />
  );
}
