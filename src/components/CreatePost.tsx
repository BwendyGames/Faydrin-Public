import { ChangeEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../contexts/AuthContext";

interface PostInput {
  title: string;
  content: string;
  avatar_url: string | null;
  user_name: string | null;
}

const createPost = async (post: PostInput, imageFile: File) => {
  const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;

  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, imageFile);

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicURLData } = supabase.storage
    .from("post-images")
    .getPublicUrl(filePath);

  const { data, error } = await supabase
    .from("posts")
    .insert({ ...post, image_url: publicURLData.publicUrl });

  if (error) throw new Error(error.message);

  return data;
};

export const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const { user } = useAuth();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File }) => {
      return createPost(data.post, data.imageFile);
    },
    onSuccess: () => {
      setTitle("");
      setContent("");
      setSelectedFile(null);
      setSuccessMessage("Post created successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile || !user) return;

    mutate({
      post: {
        title,
        content,
        avatar_url: user.user_metadata?.avatar_url || null,
        user_name:
          user?.user_metadata?.display_name ||
          user?.user_metadata?.full_name ||
          user?.email?.split("@")[0] ||
          "User",
      },
      imageFile: selectedFile,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto mt-10 bg-black/20 p-8 rounded-2xl backdrop-blur-lg border border-white/10 shadow-xl space-y-6"
    >
      <h2 className="text-2xl font-bold text-white mb-4 text-center">Create a New Post</h2>

      <div className="space-y-2">
        <label htmlFor="title" className="text-sm text-gray-300">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-gray-900/50 border border-white/10 p-3 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          placeholder="Enter your title..."
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="text-sm text-gray-300">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="w-full bg-gray-900/50 border border-white/10 p-3 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          placeholder="Share your thoughts..."
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="image" className="text-sm text-gray-300">
          Upload Image
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-gray-400 text-sm bg-gray-800/30 border border-white/10 rounded-lg p-2 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 transition"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
      >
        {isPending ? "Creating..." : "Publish Post"}
      </button>

      {/* Feedback Messages */}
      {isError && <p className="text-center text-red-400">Failed to create post. Please try again.</p>}
      {successMessage && <p className="text-center text-green-400">{successMessage}</p>}
    </form>
  );
};
