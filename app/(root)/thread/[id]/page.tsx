import ThreadCard from "@/components/cards/ThreadCard";
import CommentForm from "@/components/forms/CommentForm";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect(`/onboarding`);

  const thread = await fetchThreadById(params.id);

  return (
    <section className="relative">
      <div>
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={user?.id || ""}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      </div>

      <div className="mt-7">
        <CommentForm
          threadId={thread.id}
          currentUserImg={userInfo.image}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>

      <div className="mt-10 flex flex-col gap-7 w-full">
        {thread.children.map((thread: any) => {
          return (
            <ThreadCard
              key={thread._id}
              id={thread._id}
              currentUserId={user?.id || ""}
              parentId={thread.parentId}
              content={thread.text}
              author={thread.author}
              community={thread.community}
              createdAt={thread.createdAt}
              comments={thread.children}
              isComment
            />
          );
        })}
      </div>
    </section>
  );
};

export default page;
