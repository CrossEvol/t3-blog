"use client";

import { useRouter } from "next/navigation";
import React from "react";
import ReactMarkdown from "react-markdown";
import type { PostItem } from "../page";

const Post: React.FC<{ post: PostItem }> = ({ post }) => {
  const router = useRouter();
  const authorName = post.author ? post.author.name : "Unknown author";
  return (
    <div
      className="cursor-pointer"
      onClick={() => router.push(`/post/${post.id}`)}
    >
      <div className="m-2 flex flex-col space-y-6 bg-inherit px-8 py-12 text-inherit">
        <h2 className="text-2xl font-semibold">{post.title}</h2>
        <small>By {authorName}</small>
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default Post;
