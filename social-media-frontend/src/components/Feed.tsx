import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { FeedPost } from "./FeedPost"
import { axiosInstance } from "../hooks/axiosInstance"
import { useEffect, useRef } from "react"
import { useIntersection } from "@mantine/hooks"
import { LoaderCircle } from "lucide-react"
import { getSession } from "../hooks/getSession"

const POST_FETCH_MAX_LIMIT = 4;

interface FeedProps {
  userId?: string,
  postId?: string,
  query: string,
  likeQuery: string,
  bookmarkQuery: string,
  primaryKey: "postId" | "replyId",
  parentReplyId?: string
}

export const Feed = ({ userId, query, postId, likeQuery, bookmarkQuery, primaryKey, parentReplyId }: FeedProps) => {
  const rootRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: rootRef.current,
    threshold: 0.1
  })

  const { data, fetchNextPage, isFetching, isFetchingNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: ({ pageParam }) => {
      return axiosInstance.get(`${query}?limit=${POST_FETCH_MAX_LIMIT}&page=${pageParam}${userId ? `&userId=${userId}` : ''}${postId ? `&postId=${postId}` : ''}${parentReplyId ? `&parentReplyId=${parentReplyId}` : ''}`);
    },
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.data.hasMore ? lastPage.data.nextPage : undefined
  })

  const { data: likedPosts } = useQuery({
    queryKey: ["fetchLikedPosts", likeQuery],
    queryFn: async () => {
      const { data } = await axiosInstance.get(likeQuery);
      return data.likedPosts;
    }
  })

  const { data: bookmarkedPosts } = useQuery({
    queryKey: ["fetchBookmarkedPosts", bookmarkQuery],
    queryFn: async () => {
      const { data } = await axiosInstance.get(bookmarkQuery);
      return data.bookmarkedPosts;
    }
  })

  const { data: session } = useQuery({
    queryKey: ["getSession"],
    queryFn: getSession,
  });

  const posts = data?.pages.flatMap(page => page.data.posts) ?? [];

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage, hasNextPage, isFetchingNextPage])

  if (!posts || !likedPosts || !bookmarkedPosts || !session)
    return null;

  return <div>
    {
      posts.map((post, index) => (
        index === posts.length - 1 ? <div ref={ref} key={post[primaryKey]}><FeedPost sessionId={session.user.userId} primaryKey={primaryKey} likedPosts={likedPosts} bookmarkedPosts={bookmarkedPosts} post={post} /></div> : <FeedPost sessionId={session.user.userId} primaryKey={primaryKey} bookmarkedPosts={bookmarkedPosts} key={index} likedPosts={likedPosts} post={post} />
      ))
    }
    <div className="flex items-center justify-center mt-10 mb-6">
      {isFetchingNextPage || isFetching && <LoaderCircle className="animate-spin text-primary" />}
    </div>
  </div>
}
