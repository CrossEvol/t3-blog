import { z } from 'zod'

const colorOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
  color: z.string(),
})

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
