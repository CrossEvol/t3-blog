import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface IProps {
  content: string;
}

const Markdown = ({ content }: IProps) => {
  return (
    <div className="prose prose-slate">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
};

export default Markdown;
