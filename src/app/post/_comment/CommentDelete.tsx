"use client";

import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

interface IProps {
  commentId: number;
}

const CommentDelete = ({ commentId }: IProps) => {
  const router = useRouter();
  const deleteComment = api.comment.deleteOne.useMutation({
    onSuccess: ({}) => {
      router.refresh();
    },
  });

  return (
    <>
      <button
        className="font-semibold text-gray-600 hover:text-red-500"
        onClick={async () => await deleteComment.mutate({ commentId })}
        aria-label="Close"
      >
        {deleteComment.isLoading ? "Deleting..." : "X"}
      </button>
    </>
  );
};

export default CommentDelete;
