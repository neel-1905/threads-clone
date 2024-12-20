import Image from "next/image";
import React from "react";

type ProfileHeader = {
  accountId: string;
  authUser: string;
  name: string;
  imgUrl: string;
  bio: string;
  username: string;
};

const ProfileHeader = (props: ProfileHeader) => {
  const { accountId, authUser, bio, imgUrl, name, username } = props;
  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative size-20">
            <Image
              src={imgUrl}
              fill
              alt={name}
              className="rounded-full object-cover shadow-2xl"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-left text-heading3-bold text-light-1">
              {name}
            </h2>
            <p className="text-base-medium text-gray-1">@{username}</p>
          </div>
        </div>
      </div>

      {/* TODO: Community */}

      <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>

      <div className="mt-12 h-0.5 w-full bg-dark-3" />
    </div>
  );
};

export default ProfileHeader;
