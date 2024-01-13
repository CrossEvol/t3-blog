"use client";

import { PostItem } from "@/app/page";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import PublishButton, { options } from "./PublishSelect";

interface Props {
  post: PostItem;
}

const PostEdit = ({ post }: Props) => {
  const router = useRouter();
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [selectedOption, setSelectedOption] = useState(
    post.published ? options[0] : options[1],
  );

  const updatePost = api.post.update.useMutation({
    onSuccess: ({ id }) => {
      router.push(`/post/${id}`);
    },
  });

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      updatePost.mutate({
        id: post.id,
        name: title,
        content: content ?? "",
        published: selectedOption!.value,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="ml-8 flex flex-col items-center justify-center p-3">
        <form
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
          <textarea
            cols={50}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            rows={8}
            value={content ?? ""}
            className="mb-2 w-full rounded border p-2"
          />
          <PublishButton
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
          <div>
            <input
              disabled={!content || !title}
              type="submit"
              value="Publish"
              className="cursor-pointer border-0 bg-gray-200 px-8 py-4 text-gray-500 hover:bg-blue-500 hover:text-white"
            />
            <a
              className="ml-4 cursor-pointer text-blue-500"
              href="#"
              onClick={() => router.back()}
            >
              or Cancel
            </a>
          </div>
        </form>
      </div>
    </>
  );
};

export default PostEdit;
