import { useState } from "react";
import { Comment } from "./CommentSection";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../supabase-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";

interface Props {
  comment: Comment & { children?: Comment[] };
  postId: number;
}

const createReply = async (
  replyContent: string,
  postId: number,
  parentCommentId: number,
  userId?: string,
  author?: string
) => {
  if (!userId) {
    throw new Error("You must be logged in to reply.");
  }

  const safeAuthor = author ?? "Anonymous";

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    content: replyContent,
    parent_comment_id: parentCommentId,
    user_id: userId,
    author: safeAuthor,
  });

  if (error) throw new Error(error.message);
};

export const CommentItem = ({ comment, postId }: Props) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const { user } = useAuth();
  const queryClient = useQueryClient();

  const safeAuthor =
    user?.user_metadata?.user_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Anonymous";

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (replyContent: string) =>
      createReply(replyContent, postId, comment.id, user?.id, safeAuthor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setReplyText("");
      setShowReply(false);
    },
  });

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    mutate(replyText.trim());
  };

  return (
    <div className="pl-4 border-l border-white/10 space-y-2">
      <div className="bg-white/5 p-4 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <span
              className="text-sm font-semibold text-white bg-gray-800 px-2 py-1 rounded-full cursor-pointer transition-transform duration-200 hover:scale-105"
            >
              <Link
              to={`/user/${comment.author}`}
              className="text-sm font-semibold text-white bg-gray-800 px-2 py-1 rounded-full cursor-pointer transition-transform duration-200 hover:scale-105"
              onClick={(e) => e.stopPropagation()}
            >
              @{comment.author}
            </Link>
            </span>
            <span className="text-xs text-gray-400">
              {new Date(comment.created_at).toLocaleString()}
            </span>
          </div>
        </div>

        <p className="text-gray-200 text-sm">{comment.content}</p>

        <div className="flex items-center gap-3 mt-3">
          {user && (
            <button
              onClick={() => setShowReply((prev) => !prev)}
              className="text-xs text-purple-400 hover:text-purple-300 transition"
            >
              {showReply ? "Cancel" : "Reply"}
            </button>
          )}

          {comment.children && comment.children.length > 0 && (
            <button
              onClick={() => setCollapsed((prev) => !prev)}
              className="text-xs text-gray-400 hover:text-gray-200 flex items-center gap-1 transition"
            >
              {collapsed ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  Expand Replies
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                  Collapse Replies
                </>
              )}
            </button>
          )}
        </div>

        {showReply && (
          <form onSubmit={handleReplySubmit} className="mt-3 space-y-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full p-2 rounded bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={2}
              placeholder="Write your reply..."
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isPending}
                className="bg-purple-500 hover:bg-purple-600 transition text-white text-xs px-3 py-1 rounded"
              >
                {isPending ? "Posting..." : "Post Reply"}
              </button>
            </div>
            {isError && (
              <p className="text-red-500 text-xs">Error posting reply.</p>
            )}
          </form>
        )}
      </div>

      {/* Child comments */}
      {comment.children && comment.children.length > 0 && !collapsed && (
        <div className="space-y-2">
          {comment.children.map((child, index) => (
            <CommentItem key={index} comment={child} postId={postId} />
          ))}
        </div>
      )}
    </div>
  );
};
