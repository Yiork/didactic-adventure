import React from "react";
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import Error from "next/error";
import Link from "next/link";
import { getSession } from "next-auth/react";
import superjson from "superjson";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { trpc } from "../../../utils/trpcNext";
import prisma from "../../../utils/prisma";
import { appRouter } from "../../../server/routers/_app";
import Image from "next/image";

const Post = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { id } = props;

  const { data, isLoading } = trpc.post.useQuery({
    slug: id,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <Error statusCode={404} />;
  }

  return (
    <div>
      <div className="mb-5">
        <Link href={`/post/${data.slug}/update`}>Update post</Link>
      </div>

      <ul>
        <li>{data.title}</li>
        <li>{data.content}</li>
        <li>{data.published}</li>
      </ul>

      {data.thumbnail && (
        <Image
          alt="post-thumbnail"
          src={data.thumbnail}
          width={400}
          height={300}
          blurDataURL={data.thumbnail}
          style={{ width: "auto" }}
          priority
        />
      )}
    </div>
  );
};

export default Post;

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>
) {
  const session = await getSession();

  const ssg = await createProxySSGHelpers({
    router: appRouter,
    ctx: {
      session,
      prisma,
    },
    transformer: superjson,
  });

  const id = context.params?.id as string;

  await ssg.post.prefetch({ slug: id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
    revalidate: 1,
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
    },
  });
  return {
    paths: posts.map((post) => ({
      params: {
        id: post.id,
      },
    })),
    fallback: "blocking",
  };
};
