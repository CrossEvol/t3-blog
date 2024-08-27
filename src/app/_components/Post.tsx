import React from "react";
import ReactMarkdown from "react-markdown";
import type { PostItem } from "../page";

const Post: React.FC<{ post: PostItem }> = ({ post }) => {
  const authorName = post.author ? post.author.name : "Unknown author";
  return (
    <div className="scrollbar-thumb-slate-300 scrollbar-thin scrollbar-track-slate-200 relative m-2 mr-0 flex max-h-96 flex-col space-y-6 overflow-y-scroll bg-inherit px-8 py-12 text-inherit">
      <h2 className="text-2xl font-semibold">{post.title}</h2>
      <small>By {authorName}</small>
      <ReactMarkdown>{post.content}</ReactMarkdown>
      <a href={`/post/${post.id}`} className="absolute inset-0 z-10" />
    </div>
  );
};

export default Post;
