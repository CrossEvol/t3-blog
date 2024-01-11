"use client";

import { PostProps } from "@/app/_components/Post";
import { useSession } from "next-auth/react";
import React from "react";
import ReactMarkdown from "react-markdown";

const Post: React.FC<PostProps> = (props) => {
  // const { data: session, status } = useSession();
  // if (status === "loading") {
  //   return <div>Authenticating ...</div>;
  // }
  // const userHasValidSession = Boolean(session);
  const userHasValidSession = true;
  const postBelongsToUser =
    true; /* session?.user?.email === props.author?.email */
  let title = props.title;
  if (!props.published) {
    title = `${title} (Draft)`;
  }

  const publishPost = (id: any) => {};
  const deletePost = (id: any) => {};

  return (
    <>
      <div>
        <h2 className="mb-4 text-2xl font-bold">{title}</h2>
        <p className="text-gray-600">
          By {props?.author?.name || "Unknown author"}
        </p>
        <ReactMarkdown className="mt-4" children={props.content} />
        {!props.published && userHasValidSession && postBelongsToUser && (
          <button
            onClick={() => publishPost(props.id)}
            className="rounded bg-gray-300 px-4 py-2 text-gray-700"
          >
            Publish
          </button>
        )}
        {userHasValidSession && postBelongsToUser && (
          <button
            onClick={() => deletePost(props.id)}
            className="ml-4 rounded bg-red-500 px-4 py-2 text-white"
          >
            Delete
          </button>
        )}
      </div>
    </>
  );
};

// Post 1
const post1: PostProps = {
  id: 1,
  title: "Exploring React Hooks",
  author: {
    name: "Alice Johnson",
    email: "alice.j@example.com",
  },
  content: "In this post, we will explore the power of React Hooks...",
  published: true,
};

const Page = () => {
  return (
    <div>
      <Post props={post1} />
    </div>
  );
};

export default Page;
