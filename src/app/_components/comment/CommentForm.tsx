import { Session } from "next-auth";
import Link from "next/link";

type CommentFormProps = {
  text: string;
  setText: Function;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  session: Session | null;
};

export default function CommentForm({
  text,
  setText,
  onSubmit,
  session,
}: CommentFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <textarea
        className="flex max-h-40 w-full resize-y rounded bg-gray-200 p-3 text-gray-900 placeholder-gray-500"
        rows={2}
        placeholder={
          session
            ? `What are your thoughts?`
            : "Please login to leave a comment"
        }
        onChange={(e) => setText(e.target.value)}
        value={text}
        disabled={!session}
      />

      <div className="mt-4 flex items-center">
        {session ? (
          <div className="flex items-center space-x-6">
            <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-40">
              Send
            </button>
            <Link href={session && "/api/auth/signout"}>
              <button className="text-gray-500">Log Out</button>
            </Link>
          </div>
        ) : (
          <Link href={!session && "/api/auth/signin"}>
            <button
              type="button"
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-40"
            >
              Log In
            </button>
          </Link>
        )}
      </div>
    </form>
  );
}
