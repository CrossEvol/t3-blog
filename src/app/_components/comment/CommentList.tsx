import type { Comment } from "@/interfaces";
import distanceToNow from "@/lib/dateRelative";
import { getServerAuthSession } from "@/server/auth";

type CommentListProps = {
  comments?: Comment[];
  // onDelete: (comment: Comment) => Promise<void>;
};

export default async function CommentList({
  comments,
  // onDelete,
}: CommentListProps) {
  const session = await getServerAuthSession();

  if (!session) {
    return null;
  }

  return (
    <div className="mt-10 space-y-6">
      {comments &&
        comments.map((comment) => {
          // const isAuthor =
          //   session.user && session.user.sub === comment.user.sub;
          // const isAdmin =
          //   session.user &&
          //   session.user.email === process.env.NEXT_PUBLIC_AUTH0_ADMIN_EMAIL;

          return (
            <div key={comment.created_at} className="flex space-x-4">
              <div className="flex-shrink-0">
                <img
                  src={comment.user.picture}
                  alt={comment.user.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>

              <div className="flex-grow">
                <div className="flex space-x-2">
                  <b>{comment.user.name}</b>
                  <time className="text-gray-400">
                    {distanceToNow(comment.created_at)}
                  </time>
                  {/* {(isAdmin || isAuthor) && (
                    <button
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => onDelete(comment)}
                      aria-label="Close"
                    >
                      x
                    </button>
                  )} */}
                </div>

                <div>{comment.text}</div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
