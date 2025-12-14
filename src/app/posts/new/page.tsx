import { PostForm } from "@/components/blog/PostForm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewPostPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-4xl font-bold mb-8 text-center font-headline tracking-tight">Create a New Post</h1>
      <PostForm />
    </div>
  );
}
