"use client";

import { Session } from "next-auth";
import CommentForm from "./CommentForm";

interface IProps {
  session: Session | null;
  postId: number;
}

const CommentFormWrapper = ({ session, postId }: IProps) => {
  return <CommentForm postId={postId} session={session} />;
};

export default CommentFormWrapper;
