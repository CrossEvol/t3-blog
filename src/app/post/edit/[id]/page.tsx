import { api } from "@/trpc/server";
import PostEdit from "./Edit";

const Page = async ({ params }: { params: { id: string } }) => {
  const post = await api.post.getOne.query({ id: Number(params.id) });

  if (!post) {
    return null;
  }
  return (
    <>
      <PostEdit post={post} />
    </>
  );
};

export default Page;
