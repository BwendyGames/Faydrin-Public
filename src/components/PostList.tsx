import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url: string;
  avatar_url?: string;
  like_count?: number;
  comment_count?: number;
  user_name?: string;
  vote_sum?: number;
}

interface PostListProps {
  username?: string;
}

const fetchPosts = async (username?: string): Promise<Post[]> => {
  if (username) {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_name", username)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data as Post[];
  } else {
    const { data, error } = await supabase.rpc("get_posts_with_counts");

    if (error) throw new Error(error.message);
    return data as Post[];
  }
};

export const PostList = ({ username }: PostListProps) => {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["posts", username],
    queryFn: () => fetchPosts(username),
  });

  if (isLoading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if (!data || data.length === 0) {
    return <div className="text-center text-gray-400">No posts found.</div>;
  }

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 gap-6">
      {data.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
};
