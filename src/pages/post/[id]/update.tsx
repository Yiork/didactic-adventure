import React from "react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { getSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import superjson from "superjson";
import {
  CreatePostInput,
  createPostSchema,
} from "../../../schemas/post.schema";
import { trpc } from "../../../utils/trpcNext";
import { appRouter } from "../../../server/routers/_app";
import prisma from "../../../utils/prisma";
import useUpload from "../../../hooks/useUpload";

const UpdatePost = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const post = JSON.parse(props.post);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
  });

  const { mutate, error, isLoading } = trpc.updatePost.useMutation();

  const { uploadBox } = useUpload();

  const onSubmitPost = (values: CreatePostInput) => {
    mutate({
      slug: post.slug,
      ...values,
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmitPost)} className="flex flex-col">
        {uploadBox({ defaultValue: post.thumbnail })}

        <label>Title</label>
        <input type="text" {...register("title")} defaultValue={post.title} />
        {errors.title && (
          <small className="text-red-500">{errors?.title.message}</small>
        )}

        <label>Content</label>
        <textarea {...register("content")} defaultValue={post.content} />
        {errors.content && (
          <small className="text-red-500">{errors?.content.message}</small>
        )}

        <label>Publish</label>
        <input
          type="checkbox"
          {...register("published")}
          defaultValue={post.published}
        />

        <button disabled={isLoading} type="submit">
          {isLoading ? "Loading" : "Submit"}
        </button>
        {error && <small className="text-red-500">{error.message}</small>}
      </form>
    </div>
  );
};

export default UpdatePost;

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>
) {
  const session = await getSession();

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: {
      session,
      prisma,
    },
    transformer: superjson,
  });

  const id = context.params?.id as string;

  const post = await ssg.post.fetch({ slug: id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      post: JSON.stringify(post),
    },
  };
}
