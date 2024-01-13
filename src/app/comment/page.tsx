import CommentList from "@/app/_components/comment/CommentList";
import React from "react";
import { faker } from "@faker-js/faker";
import type { Comment } from "@/interfaces";
import Container from "../_components/comment/container";

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

const Page = () => {
  return (
    <>
      <Container>
        <CommentList comments={comments()} />
      </Container>
    </>
  );
};

export default Page;
