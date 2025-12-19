"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { createOrUpdatePost } from "@/lib/actions";
import type { Post } from "@/lib/types";
import { Card, CardContent } from "../ui/card";
import { useRouter } from "next/navigation";
import { TiptapEditor } from "./TiptapEditor";

const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  coverImage: z.string().url({ message: "Please enter a valid URL." }),
  content: z.string().min(100, { message: "Content must be at least 100 characters." }),
});

export function PostForm({ post }: { post?: Post }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: post?.id || undefined,
      title: post?.title || "",
      coverImage: post?.coverImage || "",
      content: post?.content || "",
    },
    mode: "onSubmit",
  });

  const { formState, setError, control } = form;

  useEffect(() => {
    if (formState.errors.root?.serverError) {
      toast({
        title: "Error",
        description: formState.errors.root.serverError.message,
        variant: "destructive",
      });
    }
  }, [formState.errors.root?.serverError, toast]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const formData = new FormData();
      if(data.id) formData.append("id", data.id);
      formData.append("title", data.title);
      formData.append("coverImage", data.coverImage);
      formData.append("content", data.content);

      const result = await createOrUpdatePost(null, formData);

      if (!result.success) {
        setError("root.serverError", {
          type: "manual",
          message: result.message || "An unexpected error occurred.",
        });
      } else if (result.redirect) {
        toast({
          title: post ? "Post Updated!" : "Post Created!",
          description: "Your post has been saved successfully.",
        });
        router.push(result.redirect);
      }
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {post?.id && <input type="hidden" {...form.register("id")} />}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Your amazing post title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                     <TiptapEditor
                      content={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {formState.errors.root?.serverError && (
                 <FormMessage>{formState.errors.root.serverError.message}</FormMessage>
            )}
            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? (post ? "Updating..." : "Creating...") : (post ? "Update Post" : "Create Post")}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
