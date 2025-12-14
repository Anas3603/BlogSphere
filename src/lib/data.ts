import type { Post, User } from './types';
import { PlaceHolderImages } from './placeholder-images';

// In a real application, this would be a database.
// For this example, we're using an in-memory array.

export let users: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', password: 'password123', role: 'admin', avatar: 'https://i.pravatar.cc/150?u=admin' },
  { id: '2', name: 'Regular User', email: 'user@example.com', password: 'password123', role: 'user', avatar: 'https://i.pravatar.cc/150?u=user' },
];

export let posts: Post[] = [
  {
    id: '1',
    title: 'The Future of Web Development',
    content: 'The future of web development is serverless, with a focus on component-based architectures and edge computing. Frameworks like Next.js are leading the way... (full content here)',
    authorId: '1',
    authorName: 'Admin User',
    authorAvatar: 'https://i.pravatar.cc/150?u=admin',
    createdAt: '2024-05-20T10:00:00Z',
    coverImage: PlaceHolderImages.find(p => p.id === 'blog-1')?.imageUrl || '',
    excerpt: 'Exploring the trends that will shape the next generation of web applications, from serverless architectures to AI-powered UIs.',
  },
  {
    id: '2',
    title: 'A Deep Dive into React Hooks',
    content: 'React Hooks have revolutionized how we write components. Let\'s explore useState, useEffect, and custom hooks in detail... (full content here)',
    authorId: '2',
    authorName: 'Regular User',
    authorAvatar: 'https://i.pravatar.cc/150?u=user',
    createdAt: '2024-05-18T14:30:00Z',
    coverImage: PlaceHolderImages.find(p => p.id === 'blog-2')?.imageUrl || '',
    excerpt: 'Learn how to leverage the full power of React Hooks to write cleaner, more reusable, and stateful functional components.',
  },
  {
    id: '3',
    title: 'Styling in the Modern Age: Tailwind CSS',
    content: 'Tailwind CSS offers a utility-first approach that can dramatically speed up your development workflow... (full content here)',
    authorId: '1',
    authorName: 'Admin User',
    authorAvatar: 'https://i.pravatar.cc/150?u=admin',
    createdAt: '2024-05-15T09:00:00Z',
    coverImage: PlaceHolderImages.find(p => p.id === 'blog-3')?.imageUrl || '',
    excerpt: 'A comprehensive guide to using Tailwind CSS for building beautiful, responsive designs without ever leaving your HTML.',
  },
  {
    id: '4',
    title: 'Getting Started with TypeScript',
    content: 'TypeScript adds static typing to JavaScript, catching errors early and improving code quality. This guide will get you started... (full content here)',
    authorId: '2',
    authorName: 'Regular User',
    authorAvatar: 'https://i.pravatar.cc/150?u=user',
    createdAt: '2024-05-12T11:45:00Z',
    coverImage: PlaceHolderImages.find(p => p.id === 'blog-4')?.imageUrl || '',
    excerpt: 'Embrace type safety and enhance your JavaScript projects with TypeScript. A beginner-friendly introduction.',
  },
  {
    id: '5',
    title: 'The Power of Server Components',
    content: 'Next.js Server Components allow you to write UI that runs on the server, reducing client-side JavaScript and improving performance... (full content here)',
    authorId: '1',
    authorName: 'Admin User',
    authorAvatar: 'https://i.pravatar.cc/150?u=admin',
    createdAt: '2024-05-10T16:20:00Z',
    coverImage: PlaceHolderImages.find(p => p.id === 'blog-5')?.imageUrl || '',
    excerpt: 'Unlock faster page loads and a better user experience by understanding and implementing React Server Components.',
  },
  {
    id: '6',
    title: 'User Authentication with JWT',
    content: 'JSON Web Tokens (JWT) are a popular method for securing web applications. Here\'s how to implement them... (full content here)',
    authorId: '2',
    authorName: 'Regular User',
    authorAvatar: 'https://i.pravatar.cc/150?u=user',
    createdAt: '2024-05-08T18:00:00Z',
    coverImage: PlaceHolderImages.find(p => p.id === 'blog-6')?.imageUrl || '',
    excerpt: 'A practical guide to implementing secure user authentication using JSON Web Tokens in your web application.',
  },
];

// API functions to simulate database access
export async function getPosts(): Promise<Post[]> {
  return Promise.resolve(posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
}

export async function getPost(id: string): Promise<Post | undefined> {
  return Promise.resolve(posts.find(p => p.id === id));
}

export async function getUserPosts(authorId: string): Promise<Post[]> {
  return Promise.resolve(posts.filter(p => p.authorId === authorId));
}

export async function getUsers(): Promise<User[]> {
    // In a real app, you wouldn't send passwords.
    return Promise.resolve(users.map(({ password, ...user }) => user));
}

export async function getUserById(id: string): Promise<User | undefined> {
    const user = users.find(u => u.id === id);
    if (!user) return undefined;
    const { password, ...userWithoutPassword } = user;
    return Promise.resolve(userWithoutPassword);
}
