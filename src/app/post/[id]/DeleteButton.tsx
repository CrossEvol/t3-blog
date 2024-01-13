"use client";

import Dialog, { Action } from "@/app/_components/Dialog";
import { PostItem } from "@/app/page";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface Props {
  post: PostItem;
}

const DeleteButton = ({ post }: Props) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const deletePost = api.post.delete.useMutation({
    onSuccess: ({ id, title }) => {
      console.log(`${id}:${title} has been removed`);
      router.push("/drafts");
    },
  });

  const handleConfirm = () => {
    // Your confirm logic here
    deletePost.mutateAsync({ id: post.id });
    setOpen(false);
  };

  const handleCancel = () => {
    // Your cancel logic here
    setOpen(false);
  };

  const actions: Action[] = [
    { label: "Cancel", type: "cancel", onClick: handleCancel },
    { label: "Confirm", type: "confirm", onClick: handleConfirm },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-32 cursor-pointer border-0 bg-gray-200 px-8 py-4 text-center text-gray-500 hover:bg-red-600 hover:text-white"
      >
        {"Delete"}
      </button>
      <Dialog
        title={post.title}
        content={`Confirm delete [${post.title}]`}
        actions={actions}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
};

export default DeleteButton;
