"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useRouter();

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { title, content };
      await fetch(`/api/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await navigate.push("/drafts");
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
          <h1 className="mb-4 text-2xl font-bold">New Draft</h1>
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
            value={content}
            className="mb-2 w-full rounded border p-2"
          />
          <div>
            <input
              disabled={!content || !title}
              type="submit"
              value="Create"
              className="cursor-pointer border-0 bg-gray-200 px-8 py-4 text-gray-500"
            />
            <a
              className="ml-4 cursor-pointer text-blue-500"
              href="#"
              onClick={() => navigate.push("/")}
            >
              or Cancel
            </a>
          </div>
        </form>
      </div>
    </>
  );
};

export default Page;
