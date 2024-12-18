import AccountProfile from "@/components/forms/AccountProfile";
import React from "react";
import { currentUser } from "@clerk/nextjs/server";

const Onboarding = async () => {
  const user = await currentUser();

  const userInfo = {};

  const userData = {
    id: user?.id,
    objectId: userInfo?._id,
    username: userInfo?.username || user?.username,
    name: userInfo?.name || user?.firstName || "",
    bio: userInfo?.bio || "",
    image: userInfo?.image || user?.imageUrl,
  };

  return (
    <main className="mx-auto max-w-3xl flex flex-col justify-start px-10 py-20">
      <h1 className="head-text">Onboarding</h1>

      <p className="text-base-regular text-light-2 mt-3">
        Complete your profile now to use Threads!
      </p>

      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile user={userData} btnTitle="Continue" />
      </section>
    </main>
  );
};

export default Onboarding;