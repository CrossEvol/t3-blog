import CommentFormWrapper from "@/app/post/_comment/CommentFormWrapper";
import CommentList from "@/app/post/_comment/CommentList";
import Container from "@/app/post/_comment/Container";
import { PostItem } from "@/app/page";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import ReactMarkdown from "react-markdown";
import { PostActions } from "./PostActions";
import Post from "@/app/_components/Post";

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
      <PostActions post={post} />
      <>
        <Container>
          <CommentFormWrapper session={session} postId={post.id} />
          <CommentList post={post} comments={comments} />
        </Container>
      </>
    </div>
  );
};

export default Page;
