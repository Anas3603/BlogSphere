
"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { collection, doc, addDoc, updateDoc, deleteDoc, writeBatch, setDoc } from "firebase/firestore";
import { db } from "./firebase";

import { getUserByEmail, getPost as getPostData } from "./data";
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
  const user = await getUserByEmail(email);

  // In a real app, you would compare hashed passwords.
  if (!user || user.password !== password) {
    return {
      message: "Invalid email or password",
    };
  }

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

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return {
      message: "User with this email already exists",
    };
  }

  // In a real app, you MUST hash the password before storing it.
  const newUser = {
    name,
    email,
    password,
    role: "user" as const,
    avatar: `https://i.pravatar.cc/150?u=${email}`,
  };

  const newUserRef = await addDoc(collection(db, "users"), newUser);

  cookies().set("session_token", newUserRef.id, {
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

  try {
    const userRef = doc(db, "users", session.id);
    await updateDoc(userRef, {
      name: validatedFields.data.name,
    });
    revalidatePath("/profile");
    return { message: "Profile updated successfully!", success: true };
  } catch (error) {
    return { message: "Failed to update profile", success: false };
  }
}

// --- POST ACTIONS ---

const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5),
  coverImage: z.string().url(),
  content: z.string().min(100),
});

type PostActionResult = {
    success: boolean;
    message: string;
    redirect?: string;
}


export async function createOrUpdatePost(prevState: any, formData: FormData): Promise<PostActionResult> {
  const session = await getSession();
  if (!session) {
    return { message: "Unauthorized", success: false };
  }
  
  const data = Object.fromEntries(formData.entries());
  const validatedFields = postSchema.safeParse(data);

  if (!validatedFields.success) {
    console.error(validatedFields.error);
    return { message: "Invalid fields. Please check your input.", success: false };
  }

  const { id, title, content, coverImage } = validatedFields.data;

  try {
    if (id) {
      // Update
      const postRef = doc(db, "posts", id);
      const postSnap = await getPostData(id); // Use getPost to check ownership

      if (!postSnap) {
        return { message: "Post not found", success: false };
      }
      if (postSnap.authorId !== session.id && session.role !== 'admin') {
        return { message: "Not authorized to edit this post", success: false };
      }
      
      await updateDoc(postRef, { title, content, coverImage });
      revalidatePath(`/posts/${id}`);
      revalidatePath("/admin/posts");
      // Don't redirect here, let the client handle it
      return { success: true, message: "Post updated!", redirect: `/posts/${id}` };

    } else {
      // Create
      const newPost = {
        title,
        content,
        coverImage,
        authorId: session.id,
        authorName: session.name,
        authorAvatar: session.avatar,
        createdAt: new Date().toISOString(),
        excerpt: content.substring(0, 150) + "...",
      };
      const docRef = await addDoc(collection(db, "posts"), newPost);
      revalidatePath("/");
      revalidatePath("/admin/posts");
       // Don't redirect here, let the client handle it
      return { success: true, message: "Post created!", redirect: `/posts/${docRef.id}` };
    }
  } catch (error) {
      console.error("Error creating/updating post:", error);
      return { message: "Failed to save post. Please try again.", success: false };
  }
}

export async function deletePost(id: string) {
    const session = await getSession();
    if (!session) {
        return { success: false, message: "Unauthorized" };
    }

    const postSnap = await getPostData(id);
    if (!postSnap) {
        return { success: false, message: "Post not found" };
    }

    if (postSnap.authorId !== session.id && session.role !== 'admin') {
        return { success: false, message: "Not authorized to delete this post" };
    }

    try {
        await deleteDoc(doc(db, "posts", id));
        revalidatePath('/');
        revalidatePath('/admin/posts');
        revalidatePath(`/profile`);
        // We will handle redirect on the page if it's called from a form action.
    } catch(error) {
        return { success: false, message: "Failed to delete post." };
    }
    
    // Check if called from a form action to decide on redirect
    const headersList = (await import('next/headers')).headers;
    if(headersList.get('next-action')) {
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

    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { role });
      revalidatePath('/admin/users');
      return { message: `User role updated to ${role}`, success: true };
    } catch (error) {
      return { message: "User not found or failed to update.", success: false };
    }
}
