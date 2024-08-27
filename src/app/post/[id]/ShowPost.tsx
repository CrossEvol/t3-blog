import type { PostItem } from "@/app/page";
import ReactMarkdown from "react-markdown";

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
            By {post?.author?.name ?? "Unknown author"}
          </p>
          <ReactMarkdown className="mt-4">{post.content}</ReactMarkdown>
        </div>
      </div>
    </>
  );
};

export default ShowPost;
