import { PostItem } from "@/app/page";
import { api } from "@/trpc/server";
import React from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  post: PostItem;
}

const ShowPost = ({ post }: Props) => {
  let title = post.title;
  if (!post.published) {
    title = `${title} (Draft)`;
  }

  return (
    <>
      <div className="ml-8">
        <div className="flex flex-col space-y-4">
          <h2 className="mb-4 text-2xl font-bold">{title}</h2>
          <p className="text-gray-600">
            By {post?.author?.name || "Unknown author"}
          </p>
          <ReactMarkdown className="mt-4" children={post.content} />
        </div>
      </div>
    </>
  );
};

const Page = async ({ params }: { params: { id: string } }) => {
  const post = await api.post.getOne.query({ id: Number(params.id) });

  if (!post) {
    return null;
  }

  return (
    <div>
      <ShowPost post={post} />
      <div className="ml-8 mt-12 flex w-1/5 justify-between">
        <input
          type="submit"
          value="Edit"
          className="w-32 cursor-pointer border-0 bg-gray-200 px-8 py-4 text-gray-500 hover:bg-blue-600 hover:text-white"
        />
        <input
          type="submit"
          value="Delete"
          className="w-32 cursor-pointer border-0 bg-gray-200 px-8 py-4 text-gray-500 hover:bg-red-600 hover:text-white"
        />
      </div>
    </div>
  );
};

export default Page;
