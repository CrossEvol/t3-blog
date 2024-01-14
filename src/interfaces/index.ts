export type User = {
  name: string;
  picture: string;
  sub: string;
  email?: string;
};

export type Comment = {
  user: {
    name: string | null;
    image: string | null;
  };
} & {
  id: number;
  createdAt: Date;
  url: string;
  text: string;
  userId: string;
  postId: number;
};
