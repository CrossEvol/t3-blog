"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { TabsEnum } from "../constants";
import FabContainer from "../fab-container";

const Editor = dynamic(() => import("@/app/_components/rich-text-editor"), {
  ssr: false,
});

const Create = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const createPost = api.post.create.useMutation({
    onSuccess: ({ id }) => {
      setTitle("");
      setContent("");
      router.push(`/post/${id}`);
    },
  });

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      createPost.mutate({ title, content });
    } catch (error) {
      console.error(error);
    }
  };

  const clearData = () => {
    setTitle("");
    setContent("");
  };

  const FabContent = (
    <>
      <TabsList>
        <TabsTrigger value={TabsEnum.markdown}>Markdown</TabsTrigger>
        <TabsTrigger value={TabsEnum.editor}>RichEditor</TabsTrigger>
      </TabsList>
      <Separator orientation="vertical" />
      <Button
        onClick={() => {
          try {
            createPost.mutate({ title, content });
          } catch (error) {
            console.error(error);
          }
        }}
      >
        {createPost.isLoading ? "Creating..." : "Create"}
      </Button>
      <Button className="opacity-50" onClick={clearData}>
        Cancel
      </Button>
    </>
  );

  return (
    <>
      <FabContainer components={FabContent}>
        <div className="ml-8 flex flex-col items-center justify-center p-3">
          <form
            onSubmit={submitData}
            className="mx-auto flex min-w-full flex-col space-y-4"
          >
            <h1 className="mb-4 text-2xl font-bold">New Draft</h1>
            <input
              autoFocus
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              type="text"
              value={title}
              className="mb-2 w-full rounded border p-2"
            />
            <TabsContent value={TabsEnum.markdown}>
              <Textarea
                cols={50}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Content"
                rows={20}
                value={content ?? ""}
                className="mb-2 w-full rounded border p-2"
              />
            </TabsContent>
            <TabsContent value={TabsEnum.editor}>
              <div className="min-h-96 bg-white">
                <Editor
                  postId={0}
                  content={content}
                  setContent={setContent}
                />
              </div>
            </TabsContent>
            <div>
              <button
                disabled={!content || !title || createPost.isLoading}
                type="submit"
                className="cursor-pointer border-0 bg-gray-200 px-8 py-4 text-gray-500 hover:bg-blue-500 hover:text-white"
              >
                {createPost.isLoading ? "Creating..." : "Create"}
              </button>
              <a
                className="ml-4 cursor-pointer text-blue-500"
                href="#"
                onClick={() => clearData()}
              >
                or Cancel
              </a>
            </div>
          </form>
        </div>
      </FabContainer>
    </>
  );
};

export default Create;
