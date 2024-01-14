"use client";

import { Session } from "next-auth";
import { useState } from "react";
import CommentForm from "./CommentForm";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

interface IProps {
  session: Session | null;
  postId: number;
}

const CommentFormWrapper = ({ session, postId }: IProps) => {
  const router = useRouter();
  const [text, setText] = useState("");
  const createComment = api.comment.create.useMutation({
    onSuccess: ({}) => {
      setText("");
      router.refresh();
    },
  });

  return (
    <CommentForm
      text={text}
      setText={setText}
      onSubmit={async () => createComment.mutate({ text, postId })}
      session={session}
    />
  );
};

export default CommentFormWrapper;
