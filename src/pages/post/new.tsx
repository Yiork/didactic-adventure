import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePostInput, createPostSchema } from "../../schemas/post.schema";
import { trpc } from "../../utils/trpcNext";
import useUpload from "../../hooks/useUpload";

const CreatePost = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
  });

  const { mutate, error, isLoading } = trpc.createPost.useMutation();

  const { uploadBox, preview } = useUpload();

  const onSubmitPost = (values: CreatePostInput) => {
    mutate({ ...values, thumbnail: preview });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmitPost)} className="flex flex-col">
        {uploadBox()}

        <label>Title</label>
        <input type="text" {...register("title")} />
        {errors.title && (
          <small className="text-red-500">{errors?.title.message}</small>
        )}

        <label>Content</label>
        <textarea {...register("content")} />
        {errors.content && (
          <small className="text-red-500">{errors?.content.message}</small>
        )}

        <label>Publish</label>
        <input type="checkbox" {...register("published")} />

        <button disabled={isLoading} type="submit">
          {isLoading ? "Loading" : "Submit"}
        </button>
        {error && <small className="text-red-500">{error.message}</small>}
      </form>
    </div>
  );
};

export default CreatePost;
