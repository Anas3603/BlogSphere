import type { Post } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type BlogCardProps = {
  post: Post;
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/posts/${post.id}`} className="group block">
      <Card className="h-full flex flex-col transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover rounded-t-lg"
              data-ai-hint="blog post cover"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-6">
          <CardTitle className="text-xl font-bold leading-tight mb-2">
            {post.title}
          </CardTitle>
          <p className="text-muted-foreground text-sm">{post.excerpt}</p>
        </CardContent>
        <CardFooter className="p-6 pt-0 flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.authorAvatar} alt={post.authorName} />
            <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium text-foreground">{post.authorName}</p>
            <p className="text-muted-foreground">
              {format(new Date(post.createdAt), "MMM d, yyyy")}
            </p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
