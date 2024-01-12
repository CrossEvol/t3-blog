"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { PostItem } from "../page";

const Post: React.FC<{ post: PostItem }> = ({ post }) => {
  const router = useRouter();
  const authorName = post.author ? post.author.name : "Unknown author";
  return (
    <div
      className="flex flex-col space-y-4"
      onClick={() => router.push(`/post/${post.id}`)}
    >
      <h2 className="text-2xl font-semibold">{post.title}</h2>
      <small>By {authorName}</small>
      <ReactMarkdown children={post.content} />
      <style jsx>{`
        div {
          color: inherit;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};

export default Post;
