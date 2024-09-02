'use client'

import {
  calculateDateRange,
  DatePresetEnum,
  searchPostFormSchema,
} from '@/common/trpc-schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import querystring from 'query-string'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { type z } from 'zod'
import { SearchTabEnum } from './constants'
import OptionsDrawer from './options-drawer'
import { type SearchedPost } from './page'

interface IProps {
  posts: SearchedPost[]
}

const SearchPortal = ({ posts }: IProps) => {
  const [optionsVisible, setOptionsVisible] = React.useState(false)
  const router = useRouter()

  // 1. Define your form.
  const form = useForm<z.infer<typeof searchPostFormSchema>>({
    resolver: zodResolver(searchPostFormSchema),
    defaultValues: {
      q: '',
      searchType: SearchTabEnum.Title,
      published: false,
      datePreset: DatePresetEnum.Today,
      tags: [],
      topics: [],
    },
  })

  // 2. Define a submit handler.
  function onSubmit() {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(form.getValues())
    const { startDay, endDay } = calculateDateRange(
      form.getValues('datePreset')!,
      form.getValues('date'),
    )

    const searchParams = {
      q: form.getValues('q'),
      searchType: !!form.getValues('q')
        ? form.getValues('searchType')
        : undefined,
      tags: form.getValues('tags')?.map((tag) => tag.label),
      topics: form.getValues('topics')?.map((topic) => topic.label),
      startDay: !!startDay ? format(startDay, 'yyyy-MM-dd') : undefined,
      endDay: !!endDay ? format(endDay, 'yyyy-MM-dd') : undefined,
    }

    router.push(
      '/search?' +
        querystring.stringify(searchParams, { skipEmptyString: true }),
    )
  }

  const SearchButton = 
    <Button type="submit" onClick={onSubmit}>
      Search
    </Button>
  

  return (
    <div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="w-full min-h-96 flex flex-col justify-start items-center">
          <div className="space-y-2">
            <Controller
              name="searchType"
              control={form.control}
              render={({ field }) => 
                <Tabs
                  value={field.value}
                  onValueChange={field.onChange}
                  className="w-[600px]"
                >
                  <TabsList>
                    <TabsTrigger value={SearchTabEnum.Title}>
                      {SearchTabEnum.Title}
                    </TabsTrigger>
                    <TabsTrigger value={SearchTabEnum.FullText}>
                      {SearchTabEnum.FullText}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value={SearchTabEnum.Title}>
                    <div className="flex w-full max-w-sm items-center space-x-2">
                      <Controller
                        name="q"
                        control={form.control}
                        render={({ field }) => 
                          <Input
                            {...field}
                            type="text"
                            placeholder="Search in Title ..."
                          />
                        }
                      />
                      {SearchButton}
                    </div>
                  </TabsContent>
                  <TabsContent value={SearchTabEnum.FullText}>
                    <div className="flex w-full max-w-sm items-center space-x-2">
                      <Controller
                        name="q"
                        control={form.control}
                        render={({ field }) => 
                          <Input
                            {...field}
                            type="text"
                            placeholder="Search in FullText ..."
                          />
                        }
                      />
                      {SearchButton}
                    </div>
                  </TabsContent>
                </Tabs>
              }
            />
            <div className="flex items-center space-x-2">
              <Switch
                checked={optionsVisible}
                onCheckedChange={setOptionsVisible}
                id="airplane-mode"
              />
              <Label htmlFor="airplane-mode">Search Options</Label>
            </div>
          </div>
          <OptionsDrawer
            open={optionsVisible}
            setOpen={setOptionsVisible}
            form={form}
            onSubmit={onSubmit}
          />
        </div>
      </form>
    </div>
  )
}

export default SearchPortal
