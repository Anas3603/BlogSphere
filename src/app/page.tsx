import { BlogCard } from '@/components/blog/BlogCard';
import { getPosts } from '@/lib/data';

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-4xl font-bold mb-8 text-center font-headline tracking-tight">From the Blog</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
