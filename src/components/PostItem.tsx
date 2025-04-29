import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { Post } from "./PostList";
import { Link, useNavigate } from "react-router";

interface Props {
  post: Post;
}

interface Vote {
  id: number;
  post_id: number;
  user_id: string;
  vote: number;
}

const fetchVotes = async (postId: number): Promise<Vote[]> => {
  const { data, error } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId);

  if (error) throw new Error(error.message);
  return data ?? [];
};

export const PostItem = ({ post }: Props) => {
  const navigate = useNavigate();

  const { data: votes = [] } = useQuery<Vote[], Error>({
    queryKey: ["votes", post.id],
    queryFn: () => fetchVotes(post.id),
    staleTime: 5000,
  });

  const likes = votes.filter((v) => v.vote === 1).length;

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (post.user_name) {
      navigate(`/user/${post.user_name}`);
    }
  };

  return (
    <div className="break-inside-avoid relative group bg-[rgb(24,27,32)] border border-[rgb(84,90,106)] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 mb-6">
      {/* Glow background on hover */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-pink-600 to-purple-700 opacity-0 blur-md group-hover:opacity-30 transition duration-300 pointer-events-none" />

      <Link to={`/post/${post.id}`} className="block relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 p-4">
          {post.avatar_url ? (
            <img
              src={post.avatar_url}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-purple-500"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-tl from-purple-600 to-indigo-700 border-2 border-purple-500" />
          )}
          <div>
            <div className="text-white text-lg font-bold leading-tight line-clamp-2">
              {post.title}
            </div>
            <div>
              {post.user_name && (
                <span
                  onClick={handleUserClick}
                  className="text-sm text-purple-400 hover:underline cursor-pointer"
                >
                  @{post.user_name}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Image */}
        {post.image_url && (
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
          />
        )}

        {/* Footer */}
        <div className="flex justify-between items-center p-4 text-gray-300 text-sm font-medium">
          <div className="flex items-center gap-1">
            ❤️ <span>{likes}</span>
          </div>
          <div className="flex items-center gap-1">
            💬 <span>{post.comment_count ?? 0}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};
