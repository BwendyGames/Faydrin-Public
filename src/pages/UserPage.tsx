import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { PostList } from "../components/PostList";

interface UserInfo {
  user_name: string;
  avatar_url?: string;
  banner_url?: string;
  bio?: string;
}

const fetchUserInfo = async (username: string): Promise<UserInfo | null> => {
  const { data, error } = await supabase
    .from("profiles") // <<== still using profiles
    .select("user_name, avatar_url, banner_url, bio")
    .eq("user_name", username)
    .limit(1)
    .single();

  if (error) {
    console.warn(error.message);
    return null;
  }
  return data;
};

export const UserPage = () => {
  const { username } = useParams<{ username: string }>();

  const { data: userInfo, isLoading } = useQuery<UserInfo | null, Error>({
    queryKey: ["user-info", username],
    queryFn: () => fetchUserInfo(username!),
    enabled: !!username,
  });

  if (isLoading) return <div className="text-center py-20 text-gray-400">Loading profile...</div>;
  if (!userInfo) return <div className="text-center py-20 text-gray-400">User not found.</div>;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Banner */}
      <div className="relative h-48 sm:h-64 rounded-b-2xl overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-700 shadow-md">
        {userInfo.banner_url && (
          <img
            src={userInfo.banner_url}
            alt="Banner"
            className="w-full h-full object-cover object-center"
          />
        )}
        {/* Avatar on top of banner */}
        <div className="absolute left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[rgb(24,27,32)] shadow-lg bg-gray-700">
            {userInfo.avatar_url ? (
              <img
                src={userInfo.avatar_url}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-3xl text-white bg-gradient-to-tl from-purple-600 to-indigo-700">
                {userInfo.user_name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Username and Bio */}
      <div className="mt-16 text-center">
        <h1 className="text-3xl font-bold text-white">@{userInfo.user_name}</h1>
        {userInfo.bio && (
          <p className="mt-3 text-gray-400 max-w-xl mx-auto px-4">
            {userInfo.bio}
          </p>
        )}
      </div>

      {/* Posts */}
      <div className="mt-12 px-2">
        <PostList username={username} />
      </div>
    </div>
  );
};
