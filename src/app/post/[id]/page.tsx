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
    </div>
  );
};

export default Page;
