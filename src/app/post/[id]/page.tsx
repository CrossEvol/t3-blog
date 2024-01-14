import CommentList from "@/app/_components/comment/CommentList";
import { PostItem } from "@/app/page";
import type { Comment } from "@/interfaces";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { faker } from "@faker-js/faker";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import Container from "@/app/_components/comment/Container";
import CommentFormWrapper from "@/app/_components/comment/CommentFormWrapper";
import DeleteButton from "./DeleteButton";

interface Props {
  post: PostItem;
}

const ShowPost = ({ post }: Props) => {
  let title = post.title;
  if (!post.published) {
    title = `${title} (Draft)`;
  }

  return (
    <>
      <div className="ml-8">
        <div className="flex flex-col space-y-4">
          <h2 className="mb-4 text-2xl font-bold">{title}</h2>
          <p className="text-gray-600">
            By {post?.author?.name || "Unknown author"}
          </p>
          <ReactMarkdown className="mt-4" children={post.content} />
        </div>
      </div>
    </>
  );
};

const Page = async ({ params }: { params: { id: string } }) => {
  const post = await api.post.getOne.query({ id: Number(params.id) });
  const session = await getServerAuthSession();

  if (!post) {
    return null;
  }

  const comments = await api.comment.getMany.query({ postId: post.id });

  return (
    <div>
      <ShowPost post={post} />
      {session?.user.name === post.author.name && (
        <div className="ml-8 mt-12 flex w-1/5 justify-between">
          <Link href={`/post/edit/${post.id}`}>
            <button
              value="Edit"
              className="w-32 cursor-pointer border-0 bg-gray-200 px-8 py-4 text-center text-gray-500 hover:bg-blue-600 hover:text-white"
            >
              {"Edit"}
            </button>
          </Link>
          <DeleteButton post={post} />
        </div>
      )}
      <>
        <Container>
          <CommentFormWrapper session={session} />
          <CommentList comments={comments} />
        </Container>
      </>
    </div>
  );
};

export default Page;
