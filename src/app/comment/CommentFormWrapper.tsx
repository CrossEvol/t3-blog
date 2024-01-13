"use client";

import { Session } from "next-auth";
import { useState } from "react";
import CommentForm from "../_components/comment/CommentForm";

interface IProps {
  session: Session | null;
}

const CommentFormWrapper = ({ session }: IProps) => {
  const [text, setText] = useState("");

  return (
    <CommentForm
      text={text}
      setText={setText}
      onSubmit={async (e) => {}}
      session={session}
    />
  );
};

export default CommentFormWrapper;
