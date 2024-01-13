import CommentList from "@/app/_components/comment/CommentList";
import type { Comment } from "@/interfaces";
import { getServerAuthSession } from "@/server/auth";
import { faker } from "@faker-js/faker";
import Container from "../_components/comment/container";
import CommentFormWrapper from "./CommentFormWrapper";

const comments: () => Comment[] = () => {
  let comments: Comment[] = [];
  for (let i = 1; i < 10; i++) {
    comments.push({
      id: String(i),
      created_at: faker.date.recent().getTime(),
      url: faker.internet.url(),
      text: faker.string.alpha({ length: { min: 10, max: 30 } }),
      user: {
        name: faker.internet.userName(),
        picture: faker.internet.avatar(),
        sub: faker.string.alphanumeric({ length: { min: 5, max: 20 } }),
      },
    });
  }
  return comments;
};

const Page = async () => {
  const session = await getServerAuthSession();

  return (
    <>
      <Container>
        <CommentFormWrapper session={session} />
        <CommentList comments={comments()} />
      </Container>
    </>
  );
};

export default Page;
