"use client";

import type { PostItem } from "@/app/page";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useContext, useRef, useState } from "react";
import { options } from "./PublishSelect";
import { TabsEnum } from "./constants";
import { EditContext } from "./edit-provider";

const Editor = dynamic(() => import("./rich-text-editor"), { ssr: false });

interface Props {
  post: PostItem;
}

const PostEdit = ({ post }: Props) => {
  const editContext = useContext(EditContext);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [selectedOption, _setSelectedOption] = useState(
    post.published ? options[0] : options[1],
  );

  const updatePost = api.post.update.useMutation({
    onSuccess: ({ id }) => {
      router.push(`/post/${id}`);
    },
  });

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    // try {
    //   updatePost.mutate({
    //     id: post.id,
    //     title,
    //     content: content ?? "",
    //     published: selectedOption!.value,
    //   });
    // } catch (error) {
    //   console.error(error);
    // }
  };

  React.useEffect(() => {
    editContext.setHandleSubmit(() => {
      return () =>
        console.log({
          id: post.id,
          title,
          content: content ?? "",
          published: selectedOption!.value,
        });
    });

    return () => {};
  }, []);

  return (
    <>
      <div className="ml-8 flex flex-col items-center justify-center p-3">
        <form
          ref={formRef}
          onSubmit={submitData}
          className="mx-auto flex min-w-full flex-col space-y-4"
        >
          <h1 className="mb-4 text-2xl font-bold">Edit Draft</h1>
          <input
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            value={title}
            className="mb-2 w-full rounded border p-2"
          />
          {/* <PublishButton
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          /> */}
          {/* <div>
            <button
              disabled={!content || !title || updatePost.isLoading}
              type="submit"
              className="cursor-pointer border-0 bg-gray-200 px-8 py-4 text-gray-500 hover:bg-blue-500 hover:text-white"
            >
              {updatePost.isLoading ? "Publishing..." : "Publish"}
            </button>
            <a
              className="ml-4 cursor-pointer text-blue-500"
              href="#"
              onClick={() => router.back()}
            >
              or Cancel
            </a>
          </div> */}
          <TabsContent value={TabsEnum.markdown}>
            <Textarea
              cols={50}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content"
              rows={40}
              value={content ?? ""}
              className="mb-2 w-full rounded border p-2"
            />
          </TabsContent>
          <TabsContent value={TabsEnum.editor}>
            <div className="min-h-96 bg-white">
              <Editor postId={post.id} initialMarkdown={content!} />
            </div>
          </TabsContent>
        </form>
      </div>
    </>
  );
};

export default PostEdit;
