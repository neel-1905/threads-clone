"use client";

import React from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { commentValidation } from "@/lib/validations/thread";
import { Button } from "../ui/button";
import Image from "next/image";
import { addCommentToThread } from "@/lib/actions/thread.actions";

type CommentProps = {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
};

const CommentForm = (props: CommentProps) => {
  const { currentUserId, currentUserImg, threadId } = props;

  const pathname = usePathname();
  const router = useRouter();

  const form = useForm<z.infer<typeof commentValidation>>({
    resolver: zodResolver(commentValidation),
    defaultValues: {
      thread: "",
      //   accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof commentValidation>) => {
    const res = await addCommentToThread(
      threadId,
      values.thread,
      JSON.parse(currentUserId),
      pathname
    );
  };

  return (
    <div>
      <h1 className="text-white">Comment Form</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
          <FormField
            control={form.control}
            name="thread"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3 w-full">
                <FormLabel>
                  <Image
                    src={currentUserImg}
                    width={48}
                    height={48}
                    alt={`Profile Image`}
                    className="rounded-full object-cover"
                  />
                </FormLabel>
                <FormControl className="border-none bg-transparent">
                  <Input
                    type="text"
                    placeholder="Comment..."
                    className="no-focus outline-none text-light-1"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="comment-form_btn">
            Comment
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CommentForm;
