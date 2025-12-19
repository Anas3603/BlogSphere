import { getPost } from "@/lib/data";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deletePost } from "@/lib/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import parse from 'html-react-parser';

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  const session = await getSession();

  if (!post) {
    notFound();
  }

  const userIsAuthorOrAdmin =
    session && (session.id === post.authorId || session.role === "admin");

  const deletePostWithId = deletePost.bind(null, post.id);

  return (
    <article className="container max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 font-headline">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.authorAvatar} alt={post.authorName} />
              <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{post.authorName}</p>
              <p className="text-sm">
                Posted on {format(new Date(post.createdAt), "MMMM d, yyyy")}
              </p>
            </div>
          </div>
        </div>
        {userIsAuthorOrAdmin && (
          <div className="mt-6 flex gap-2">
            <Button asChild>
              <Link href={`/posts/edit/${post.id}`}>Edit Post</Link>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Post</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    post.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <form action={deletePostWithId}>
                    <AlertDialogAction asChild>
                      <Button type="submit" variant="destructive">Delete</Button>
                    </AlertDialogAction>
                  </form>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover"
          data-ai-hint="blog post cover"
        />
      </div>

      <div className="prose dark:prose-invert max-w-none text-lg">
        {parse(post.content)}
      </div>
    </article>
  );
}
