import React, { useState } from "react";
import { trpc } from "../utils/trpcNext";
import Link from "next/link";
import Image from "next/image";

const Index = () => {
  const [page, setPage] = useState(0);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isInitialLoading,
    isFetchingNextPage,
  } = trpc.infinitePosts.useInfiniteQuery(
    {
      limit: 5,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const onFetchNextPage = () => {
    fetchNextPage().catch((err) => console.error(err));
    setPage((prev) => prev + 1);
  };

  const post = data?.pages[page]?.items;

  const postList = isInitialLoading ? (
    <div>..loading</div>
  ) : (
    post?.map((post) => (
      <div key={post.id} className="border rounded">
        {post.thumbnail && (
          <Image
            alt="post-thumbnail"
            src={post.thumbnail}
            width={400}
            height={300}
            blurDataURL={post.thumbnail}
            priority
            style={{ width: "auto" }}
          />
        )}
        <div>{post.title}</div>
        <Link href={`/post/${post.slug}`}>Go to post</Link>
      </div>
    ))
  );

  return (
    <div>
      <div className="mb-5">
        <Link href={`/post/new`}>Create post</Link>
      </div>
      {postList}
      {hasNextPage && (
        <button
          disabled={isInitialLoading || isFetchingNextPage}
          onClick={onFetchNextPage}
        >
          {isFetchingNextPage ? "...loading" : "Fetch more page"}
        </button>
      )}
    </div>
  );
};

export default Index;
