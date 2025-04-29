import { useQuery } from "@tanstack/react-query";
import { Post } from "./PostList";
import { supabase } from "../supabase-client";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";
import { Link } from "react-router";

interface Props {
  postId: number;
}

const fetchPostById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data as Post;
};

export const PostDetail = ({ postId }: Props) => {
  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
  });

  if (isLoading) return <div className="text-gray-400">Loading post...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div className="space-y-8 max-w-3xl mx-auto pt-2 pb-6 px-4">
      {/* Header */}
      <div className="flex items-center gap-4">
  {data?.avatar_url ? (
    <img
      src={data.avatar_url}
      alt="User Avatar"
      className="w-14 h-14 rounded-full object-cover border-2 border-purple-500"
    />
  ) : (
    <div className="w-14 h-14 rounded-full bg-gradient-to-tl from-[#8A2BE2] to-[#491F70] border-2 border-purple-500" />
  )}
  {data?.user_name && (
    <Link
      to={`/user/${data.user_name}`}
      className="text-white bg-gray-800 px-3 py-1 rounded-full font-semibold cursor-pointer transition-transform duration-200 hover:scale-105"
      onClick={(e) => e.stopPropagation()}
    >
      @{data.user_name}
    </Link>
  )}

</div>

      {/* Title */}
      <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight">
        {data?.title}
      </h2>

      {/* Image */}
      {data?.image_url && (
        <a href={data.image_url} target="_blank" rel="noopener noreferrer">
          <img
            src={data.image_url}
            alt={data.title}
            className="rounded-2xl w-full max-h-[600px] object-contain"
          />
        </a>
      )}

      {/* Content */}
      <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
        {data?.content}
      </p>

      {/* Date */}
      <p className="text-gray-500 text-sm">
        Posted on: {new Date(data!.created_at).toLocaleDateString()}
      </p>

      {/* Like / Comment Section */}
      <div className="space-y-6">
        <LikeButton postId={postId} />
        <CommentSection postId={postId} />
      </div>
    </div>
  );
};
