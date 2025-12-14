import { Button } from "@/components/ui/button";
import { getPosts } from "@/lib/data";
import Link from "next/link";
import { PostsDataTable } from "@/components/admin/PostsDataTable";

export default async function AdminPostsPage() {
  const posts = await getPosts();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold font-headline tracking-tight">Manage Posts</h1>
        <Button asChild>
          <Link href="/posts/new">Create New Post</Link>
        </Button>
      </div>
      <PostsDataTable data={posts} />
    </div>
  );
}
