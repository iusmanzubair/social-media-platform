import { ArrowLeft, LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { User } from "./User";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../hooks/axiosInstance";
import { getSession } from "../hooks/getSession";
import { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";

const USER_FETCH_MAX_LIMIT = 10

interface UserFollowingProps {
  query: string,
  title: string
}

export const UserConnections = ({ query, title }: UserFollowingProps) => {
  const navigate = useNavigate();
  const rootRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: rootRef.current,
    threshold: 0.1
  })

  const { data, fetchNextPage, isFetching, isFetchingNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["fetchFollowing"],
    queryFn: ({ pageParam }) => {
      return axiosInstance.get(`${query}?limit=${USER_FETCH_MAX_LIMIT}&page=${pageParam}`);
    },
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.data.hasMore ? lastPage.data.nextPage : undefined
  })


  const { data: following } = useQuery({
    queryKey: ["fetchFollowingIdOnly"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/follow/fetch-following-id");
      return data.following
    },
  });

  const { data: session } = useQuery({
    queryKey: ["getSession"],
    queryFn: getSession,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage, hasNextPage, isFetchingNextPage])

  const users = data?.pages.flatMap(page => page.data.users) ?? [];
  if (!users)
    return null;

  return <div className="mt-2 overflow-y-scroll scrollbar-hide">
    <div className="px-4 flex items-center gap-4 pb-6 border-b border-b-gray-300">
      <ArrowLeft className="w-5 h-5 cursor-pointer" onClick={() => navigate(-1)} />
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
    <div className="space-y-5 px-4 mt-3">
      {users.map((user, index) => (
        index === users.length - 1 ? <div ref={ref} key={user.userId}><User key={user.userId} sessionUserId={session.user.userId} user={user} following={following} /></div> : <User key={user.userId} sessionUserId={session.user.userId} user={user} following={following} />
      ))}
    </div>

    <div className="flex items-center justify-center mt-10 mb-6">
      {isFetchingNextPage || isFetching && <LoaderCircle className="animate-spin text-primary" />}
    </div>
  </div>
}
