"use client"; // this registers <Editor> as a Client Component
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";

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

// Our <Editor> component we can reuse later
export default function RichTextEditor() {
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

  // Renders the editor instance using a React component.
  return <BlockNoteView editor={editor} />;
}
