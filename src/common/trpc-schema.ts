import { SearchTabEnum } from '@/app/search/constants'
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

export const updatePostSchema = updatePostFormSchema
  .omit({ topic: true })
  .extend({ topic: colorOptionSchema.nullable() })
  .partial({
    tags: true,
    topic: true,
  })

export type UpdatePostParams = z.infer<typeof updatePostSchema>

export enum DatePresetEnum {
  Today = 'Today',
  Tomorrow = 'Tomorrow',
  Three = 'In 3 days',
  Week = 'In a week',
  Month = 'In a month',
}

const datePresetSchema = z.enum([
  DatePresetEnum.Today,
  DatePresetEnum.Tomorrow,
  DatePresetEnum.Three,
  DatePresetEnum.Week,
  DatePresetEnum.Month,
])

const searchTypeSchema = z.enum([SearchTabEnum.Title, SearchTabEnum.FullText])

export const searchPostFormSchema = z
  .object({
    q: z.string().min(1),
    tags: z.array(colorOptionSchema),
    topics: z.array(colorOptionSchema),
    published: z.boolean(),
    searchType: searchTypeSchema,
    date: z.date(),
    datePreset: datePresetSchema,
  })
  .partial()

export type SearchPostForm = UseFormReturn<z.infer<typeof searchPostFormSchema>>
