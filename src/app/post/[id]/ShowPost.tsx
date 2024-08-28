import type { PostItem } from "@/app/page";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
          <div className="prose prose-slate bg-white p-8">
            <ReactMarkdown remarkPlugins={[remarkGfm]} className="mt-4">
              {post.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowPost;
