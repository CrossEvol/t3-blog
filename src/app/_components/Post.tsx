"use client";

import Link from "next/link";
import React from "react";
import ReactMarkdown from "react-markdown";
import { PostItem } from "../page";

const Post: React.FC<{ post: PostItem }> = ({ post }) => {
  const authorName = post.author ? post.author.name : "Unknown author";
  return (
    <Link href={`/post/${post.id}`}>
      <div className="m-2 flex flex-col space-y-6 bg-inherit px-8 py-12 text-inherit">
        <h2 className="text-2xl font-semibold">{post.title}</h2>
        <small>By {authorName}</small>
        <ReactMarkdown children={post.content} />
      </div>
    </Link>
  );
};

export default Post;
