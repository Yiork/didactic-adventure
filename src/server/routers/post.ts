import slugify from "slugify";
import ShortUniqueId from "short-unique-id";
import { router, procedure } from "../trpc";
import {
  createPostSchema,
  infinitePostSchema,
  postSchema,
  updatePostSchema,
} from "../../schemas/post.schema";
import { protectedProcedure } from "../authorization";
import { getFileUrl } from "../../utils/getFileUrl";

export const postRouter = router({
  post: procedure.input(postSchema).query(({ ctx, input }) => {
    return ctx.prisma.post.findFirst({
      where: {
        slug: input.slug,
      },
    });
  }),
  posts: procedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),
  createPost: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      const uid = new ShortUniqueId({ length: 10 });
      const { content, thumbnail, published, title } = input;

      let image;

      if (thumbnail) {
        image = await getFileUrl(thumbnail, "post-thumbnail");
      }

      return ctx.prisma.post.create({
        data: {
          slug: `${slugify(input.title)}-${uid()}`,
          content,
          published,
          title,
          thumbnail: image,
          author: {
            connect: {
              id: ctx.user.id,
            },
          },
        },
      });
    }),
  updatePost: protectedProcedure
    .input(updatePostSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.post.update({
        where: {
          slug: input.slug,
        },
        data: {
          title: input.title,
          content: input.content,
          published: input.published,
        },
      });
    }),
  infinitePosts: procedure
    .input(infinitePostSchema)
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 10;
      const { cursor } = input;

      const items = await ctx.prisma.post.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "asc",
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }
      return {
        items,
        nextCursor,
      };
    }),
});
