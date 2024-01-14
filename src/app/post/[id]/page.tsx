import CommentFormWrapper from "@/app/post/_comment/CommentFormWrapper";
import CommentList from "@/app/post/_comment/CommentList";
import Container from "@/app/post/_comment/Container";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import PostActions from "./PostActions";
import ShowPost from "./ShowPost";

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
