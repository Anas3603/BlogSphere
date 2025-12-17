
import { db } from './firebase';
import { collection, doc, getDoc, getDocs, query, where, orderBy, limit, setDoc, addDoc } from 'firebase/firestore';
import type { Post, User } from './types';
import { PlaceHolderImages } from './placeholder-images';

// --- Seeding Data (for first-time setup) ---
// This is a simple check. In a real app, you might have a more robust seeding strategy.
const seedData = async () => {
  const usersRef = collection(db, "users");
  const usersSnapshot = await getDocs(query(usersRef, limit(1)));
  if (usersSnapshot.empty) {
    console.log("No users found, seeding initial data...");
    
    const initialUsers = [
      { name: 'Admin User', email: 'admin@example.com', role: 'admin' as const, avatar: 'https://i.pravatar.cc/150?u=admin', password: 'password123' },
      { name: 'Regular User', email: 'user@example.com', role: 'user' as const, avatar: 'https://i.pravatar.cc/150?u=user', password: 'password123' },
    ];

    let adminUserId = '';
    for (const user of initialUsers) {
        const userRef = await addDoc(usersRef, user);
        if (user.email === 'admin@example.com') {
          adminUserId = userRef.id;
        }
    }

    const initialPosts: Omit<Post, 'id' | 'authorId' | 'authorName' | 'authorAvatar'>[] = [
        {
            title: 'The Future of Web Development',
            content: 'The future of web development is serverless, with a focus on component-based architectures and edge computing. Frameworks like Next.js are leading the way... (full content here)',
            createdAt: new Date('2024-05-20T10:00:00Z').toISOString(),
            coverImage: PlaceHolderImages.find(p => p.id === 'blog-1')?.imageUrl || '',
            excerpt: 'Exploring the trends that will shape the next generation of web applications, from serverless architectures to AI-powered UIs.',
        },
        {
            title: 'A Deep Dive into React Hooks',
            content: 'React Hooks have revolutionized how we write components. Let\'s explore useState, useEffect, and custom hooks in detail... (full content here)',
            createdAt: new Date('2024-05-18T14:30:00Z').toISOString(),
            coverImage: PlaceHolderImages.find(p => p.id === 'blog-2')?.imageUrl || '',
            excerpt: 'Learn how to leverage the full power of React Hooks to write cleaner, more reusable, and stateful functional components.',
        },
        {
            title: 'Styling in the Modern Age: Tailwind CSS',
            content: 'Tailwind CSS offers a utility-first approach that can dramatically speed up your development workflow... (full content here)',
            createdAt: new Date('2024-05-15T09:00:00Z').toISOString(),
            coverImage: PlaceHolderImages.find(p => p.id === 'blog-3')?.imageUrl || '',
            excerpt: 'A comprehensive guide to using Tailwind CSS for building beautiful, responsive designs without ever leaving your HTML.',
        },
    ];

    if (adminUserId) {
        for (const post of initialPosts) {
          const newPost = {
            ...post,
            authorId: adminUserId,
            authorName: 'Admin User',
            authorAvatar: 'https://i.pravatar.cc/150?u=admin',
          }
          await addDoc(collection(db, 'posts'), newPost);
        }
    }
    
    console.log("Seeding complete.");
  }
};
// We'll call this once when the module loads on the server.
// It's not perfect but good enough for this example.
seedData().catch(console.error);


// --- API Functions ---

// POSTS
export async function getPosts(): Promise<Post[]> {
  const postsCollection = collection(db, 'posts');
  const q = query(postsCollection, orderBy('createdAt', 'desc'));
  const postsSnapshot = await getDocs(q);
  return postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
}

export async function getPost(id: string): Promise<Post | undefined> {
  const postDoc = await getDoc(doc(db, 'posts', id));
  if (!postDoc.exists()) {
    return undefined;
  }
  return { id: postDoc.id, ...postDoc.data() } as Post;
}

export async function getUserPosts(authorId: string): Promise<Post[]> {
    const postsCollection = collection(db, 'posts');
    const q = query(postsCollection, where('authorId', '==', authorId), orderBy('createdAt', 'desc'));
    const postsSnapshot = await getDocs(q);
    return postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
}


// USERS
export async function getUserByEmail(email: string): Promise<(User & { id: string; password?: string }) | undefined> {
  const usersCollection = collection(db, 'users');
  const q = query(usersCollection, where('email', '==', email), limit(1));
  const userSnapshot = await getDocs(q);

  if (userSnapshot.empty) {
    return undefined;
  }
  const userDoc = userSnapshot.docs[0];
  return { id: userDoc.id, ...userDoc.data() } as (User & { id: string; password?: string });
}

export async function getUserById(id: string): Promise<User | undefined> {
  const userDoc = await getDoc(doc(db, 'users', id));
  if (!userDoc.exists()) {
    return undefined;
  }
  const { password, ...user } = userDoc.data() as User & { password?: string };
  return { id: userDoc.id, ...user } as User;
}

export async function getUsers(): Promise<Omit<User, 'password'>[]> {
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    return usersSnapshot.docs.map(doc => {
        const { password, ...user } = doc.data();
        return { id: doc.id, ...user };
    }) as Omit<User, 'password'>[];
}
