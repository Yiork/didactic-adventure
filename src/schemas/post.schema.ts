import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
  published: z.boolean(),
  thumbnail: z.string().nullish(),
});

export const postSchema = z.object({
  slug: z.string(),
});

export const updatePostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
  published: z.boolean(),
  slug: z.string(),
});

export const infinitePostSchema = z.object({
  limit: z.number().min(1).max(100).nullish(),
  cursor: z.string().nullish(),
});

export type CreatePostInput = z.TypeOf<typeof createPostSchema>;
