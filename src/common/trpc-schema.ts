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
    q: z.string(),
    tags: z.array(colorOptionSchema),
    topics: z.array(colorOptionSchema),
    published: z.boolean(),
    searchType: searchTypeSchema,
    date: z.date(),
    datePreset: datePresetSchema,
  })
  .partial()

export type SearchPostForm = UseFormReturn<z.infer<typeof searchPostFormSchema>>

export const searchPostSchema = searchPostFormSchema
  .omit({ date: true, datePreset: true, tags: true, topics: true })
  .extend({
    startDay: z.date(),
    endDay: z.date(),
    tags: z.array(z.string()),
    topics: z.array(z.string()),
  })
  .partial()

export type SearchPostParams = z.infer<typeof searchPostSchema>

export const postSearchParamsSchema = z
  .object({
    q: z.string(),
    tags: z.array(z.string()),
    topics: z.array(z.string()),
    published: z.boolean(),
    searchType: searchTypeSchema,
    startDay: z.string(),
    endDay: z.string(),
  })
  .partial()

export type PostSearchParams = z.infer<typeof postSearchParamsSchema>

export const calculateDateRange = (preset: DatePresetEnum, today?: Date) => {
  let startDay
  let endDay

  if (!today) {
    return { startDay, endDay }
  }

  startDay = new Date(today)
  endDay = new Date(today)

  switch (preset) {
    case DatePresetEnum.Today:
      // Start and end are today
      break
    case DatePresetEnum.Tomorrow:
      endDay.setDate(today.getDate() + 1)
      break
    case DatePresetEnum.Three:
      endDay.setDate(today.getDate() + 3)
      break
    case DatePresetEnum.Week:
      endDay.setDate(today.getDate() + 7)
      break
    case DatePresetEnum.Month:
      endDay.setMonth(today.getMonth() + 1)
      break
    default:
      startDay = undefined
      endDay = undefined
  }

  return { startDay, endDay }
}

export const safeDateParam = (date?: string) => {
  return !!date ? new Date(date) : undefined
}
