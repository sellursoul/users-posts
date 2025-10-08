import { User, Post, Comment } from '../interfaces';

export function generateUsers(count = 1000): User[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
  }));
}

export function generatePosts(count = 10000, users: User[]): Post[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    userId: users[Math.floor(Math.random() * users.length)].id,
    title: `Post Title ${i + 1}`,
    description: `This is the description of post ${i + 1}.`,
  }));
}

export function generateComments(postId: number): Comment[] {
  const count = 2 + Math.floor(Math.random() * 14);
  return Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    postId,
    description: `Comment ${i + 1} for post ${postId}`,
  }));
}
