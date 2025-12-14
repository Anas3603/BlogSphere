export type User = {
  id: string;
  name: string;
  email: string;
  password?: string; // Should not be sent to client
  role: 'admin' | 'user';
  avatar: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  coverImage: string;
  excerpt: string;
};
