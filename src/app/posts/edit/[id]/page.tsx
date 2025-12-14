import { PostForm } from "@/components/blog/PostForm";
import { getSession } from "@/lib/auth";
import { getPost } from "@/lib/data";
import { redirect, notFound } from "next/navigation";

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  const post = await getPost(params.id);

  if (!session) {
    redirect("/login");
  }

  if (!post) {
    notFound();
  }

  if (session.id !== post.authorId && session.role !== 'admin') {
    redirect('/unauthorized');
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-4xl font-bold mb-8 text-center font-headline tracking-tight">Edit Post</h1>
      <PostForm post={post} />
    </div>
  );
}
