import { CreatePost } from "@/app/_components/create-post";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import Post, { PostProps } from "./_components/Post";

// Post 1
const post1: PostProps = {
  id: 1,
  title: "Exploring React Hooks",
  author: {
    name: "Alice Johnson",
    email: "alice.j@example.com",
  },
  content: "In this post, we will explore the power of React Hooks...",
  published: true,
};

// Post 2
const post2: PostProps = {
  id: 2,
  title: "The Art of Debugging",
  author: null,
  content:
    "Debugging is an essential skill for developers. Let's dive into some tips and tricks...",
  published: true,
};

// Post 3
const post3: PostProps = {
  id: 3,
  title: "Introduction to TypeScript",
  author: {
    name: "Bob Smith",
    email: "bob.s@example.com",
  },
  content:
    "Learn the basics of TypeScript and how it can enhance your JavaScript projects...",
  published: false,
};

const postList = [post1, post2, post3];

export default async function Home() {
  const hello = await api.post.hello.query({ text: "from tRPC" });
  const session = await getServerAuthSession();

  return (
    <div className="my-4 ml-8 w-11/12">
      <h1 className="pb-6 text-4xl font-bold">Public Feed</h1>
      <Blog feed={postList} />
    </div>
  );
}

type Props = {
  feed: PostProps[];
};

const Blog: React.FC<Props> = (props) => {
  return (
    <main className="space-y-8">
      {props.feed.map((post) => (
        <div
          key={post.id}
          className=" bg-white transition-shadow duration-100 ease-in hover:shadow-md"
        >
          <Post post={post} />
        </div>
      ))}
    </main>
  );
};
