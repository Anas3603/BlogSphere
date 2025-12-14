import type { Post } from "@/lib/types";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { format } from "date-fns";

export function UserPosts({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-12">
        <h3 className="text-xl font-semibold">No posts yet</h3>
        <p className="mt-2">You haven't written any blog posts. Start writing today!</p>
        <Button asChild className="mt-4">
            <Link href="/posts/new">Create a new post</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>
                Published on {format(new Date(post.createdAt), "MMM d, yyyy")}
              </CardDescription>
            </div>
            <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                    <Link href={`/posts/edit/${post.id}`}>Edit</Link>
                </Button>
                 <Button asChild variant="secondary" size="sm">
                    <Link href={`/posts/${post.id}`}>View</Link>
                </Button>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
