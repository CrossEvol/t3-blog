"use client";

import type { PostItem } from "@/app/page";
import { api } from "@/trpc/react";
import type { Session } from "next-auth";
import { useRouter } from "next/navigation";

interface IProps {
  session: Session | null;
  commentId: number;
  post: PostItem;
}

const CommentDelete = ({ commentId, session, post }: IProps) => {
  const router = useRouter();

  if (!session) {
    return null;
  }

  const isAuthor = session.user && session.user.name === post.author.name;
  const isAdmin = session.user && session.user.role === "ADMIN";
  const deleteComment = api.comment.deleteOne.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <>
      {(isAuthor || isAdmin) && (
        <button
          className="font-semibold text-gray-600 hover:text-red-500"
          onClick={async () => await deleteComment.mutateAsync({ commentId })}
          aria-label="Close"
        >
          {deleteComment.isLoading ? "Deleting..." : "X"}
        </button>
      )}
    </>
  );
};

export default CommentDelete;
