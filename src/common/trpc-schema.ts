import { type UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

const colorOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
  color: z.string(),
})

export type CreatePostForm = UseFormReturn<z.infer<typeof createPostFormSchema>>

export const createPostFormSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  tags: z.array(colorOptionSchema),
  topic: colorOptionSchema,
  published: z.boolean(),
})

export const createPostSchema = createPostFormSchema.partial({
  topic: true,
  tags: true,
})

export type UpdatePostForm = UseFormReturn<z.infer<typeof updatePostFormSchema>>

export const updatePostFormSchema = createPostFormSchema.extend({
  id: z.number(),
})

export const updatePostSchema = updatePostFormSchema.partial({
  topic: true,
  tags: true,
})

export type UpdatePostParams = z.infer<typeof updatePostSchema>
