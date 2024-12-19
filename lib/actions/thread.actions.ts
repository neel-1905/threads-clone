"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { Error } from "mongoose";

type ThreadProps = {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
};

export async function createThread(thread: ThreadProps) {
  const { author, communityId, path, text } = thread;

  connectToDB();

  try {
    // TODO: change the create function to use community id

    const createdThread = await Thread.create({
      text,
      author,
      community: communityId,
    });

    // updating user model to include the new thread
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }
}

export async function fetchThreads(pageNumber = 1, pageSize = 20) {
  connectToDB();

  // calculate the number of posts to skip
  const skipAmt = (pageNumber - 1) * pageSize;

  // only threads without the comments
  const threads = await Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmt)
    .limit(pageSize)
    .populate({ path: "author", model: User })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    });

  const totalThreadsCount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  });

  const isNext = totalThreadsCount > skipAmt + threads.length;

  return { threads, isNext };
}

export async function fetchThreadById(id: string) {
  connectToDB();

  try {
    // TODO : POPULATE COMMUNITY
    const thread = await Thread.findById(id)
      .populate({
        path: `author`,
        model: User,
        select: "id _id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "id _id name parentId image",
            },
          },
        ],
      })
      .exec();

    return thread;
  } catch (error: any) {
    throw new Error(`Failed to fetch thread: ${error.message}`);
  }
}

export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();

  try {
    const thread = await Thread.findById(threadId);
    if (!thread) throw new Error("Thread not found");

    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    const savedCommentThread = await commentThread.save();

    // update the original thread to have the id of the comment thread
    await thread.children.push(savedCommentThread._id);

    await thread.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to comment: ${error.message}`);
  }
}
