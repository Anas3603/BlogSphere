"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { users, posts } from "./data";
import { getSession } from "./auth";

// --- AUTH ACTIONS ---

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function login(prevState: any, formData: FormData) {
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: "Invalid fields",
    };
  }

  const { email, password } = validatedFields.data;
  const user = users.find((u) => u.email === email);

  if (!user || user.password !== password) {
    return {
      message: "Invalid email or password",
    };
  }

  // Simulate JWT by setting a session cookie
  cookies().set("session_token", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // One week
    path: "/",
  });

  redirect("/");
}

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function register(prevState: any, formData: FormData) {
  const validatedFields = registerSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: "Invalid fields",
    };
  }

  const { name, email, password } = validatedFields.data;

  if (users.find((u) => u.email === email)) {
    return {
      message: "User with this email already exists",
    };
  }

  const newUser = {
    id: String(users.length + 1),
    name,
    email,
    password,
    role: "user" as const,
    avatar: `https://i.pravatar.cc/150?u=${email}`,
  };

  users.push(newUser);

  cookies().set("session_token", newUser.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // One week
    path: "/",
  });

  redirect("/");
}

export async function signOut() {
  cookies().delete("session_token");
  redirect("/login");
}

// --- PROFILE ACTIONS ---

const profileSchema = z.object({
  name: z.string().min(2),
});

export async function updateProfile(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { message: "Unauthorized", success: false };
  }

  const validatedFields = profileSchema.safeParse({ name: formData.get("name") });

  if (!validatedFields.success) {
    return { message: "Invalid name", success: false };
  }

  const userIndex = users.findIndex((u) => u.id === session.id);
  if (userIndex !== -1) {
    users[userIndex].name = validatedFields.data.name;
    revalidatePath("/profile");
    return { message: "Profile updated successfully!", success: true };
  }

  return { message: "User not found", success: false };
}

// --- POST ACTIONS ---

const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5),
  coverImage: z.string().url(),
  content: z.string().min(100),
});

export async function createOrUpdatePost(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { message: "Unauthorized", success: false };
  }
  
  const data = Object.fromEntries(formData.entries());
  const validatedFields = postSchema.safeParse(data);

  if (!validatedFields.success) {
    return { message: "Invalid fields", success: false };
  }

  const { id, title, content, coverImage } = validatedFields.data;

  if (id) {
    // Update
    const postIndex = posts.findIndex((p) => p.id === id);
    if (postIndex === -1) {
      return { message: "Post not found", success: false };
    }
    if (posts[postIndex].authorId !== session.id && session.role !== 'admin') {
      return { message: "Not authorized to edit this post", success: false };
    }
    posts[postIndex] = { ...posts[postIndex], title, content, coverImage };
    revalidatePath(`/posts/${id}`);
    revalidatePath("/admin/posts");
    redirect(`/posts/${id}`);
  } else {
    // Create
    const newPost = {
      id: String(posts.length + 1),
      title,
      content,
      coverImage,
      authorId: session.id,
      authorName: session.name,
      authorAvatar: session.avatar,
      createdAt: new Date().toISOString(),
      excerpt: content.substring(0, 150) + "...",
    };
    posts.unshift(newPost);
    revalidatePath("/");
    revalidatePath("/admin/posts");
    redirect(`/posts/${newPost.id}`);
  }
}

export async function deletePost(id: string) {
    const session = await getSession();
    if (!session) {
        throw new Error("Unauthorized");
    }

    const postIndex = posts.findIndex(p => p.id === id);
    if (postIndex === -1) {
        throw new Error("Post not found");
    }

    const post = posts[postIndex];
    if (post.authorId !== session.id && session.role !== 'admin') {
        throw new Error("Not authorized to delete this post");
    }

    posts.splice(postIndex, 1);
    revalidatePath('/');
    revalidatePath('/admin/posts');
    revalidatePath(`/profile`);
    // This action can be called from a form or client-side, 
    // so redirect might not always be desired. We will handle redirect on the page.
    // Let's redirect if it's a form action from post page
    const headers = new Headers();
    if(headers.get('next-action')) {
       redirect('/'); 
    }

    return { success: true, message: "Post deleted successfully" }
}

// --- ADMIN ACTIONS ---

export async function changeUserRole(userId: string, role: 'admin' | 'user') {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return { message: "Unauthorized", success: false };
    }

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return { message: "User not found", success: false };
    }

    users[userIndex].role = role;
    revalidatePath('/admin/users');
    return { message: `User role updated to ${role}`, success: true };
}
