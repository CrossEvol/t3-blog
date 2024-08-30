'use client'

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { TabEnum } from './constants'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import OptionsDrawer from './options-drawer'

const Page = () => {
  const [optionsVisible, setOptionsVisible] = React.useState(false)

  return (
    <div className="w-full min-h-96 flex flex-col justify-start items-center">
      <div className="space-y-2">
        <Tabs defaultValue={TabEnum.Title} className="w-[600px]">
          <TabsList>
            <TabsTrigger value={TabEnum.Title}>{TabEnum.Title}</TabsTrigger>
            <TabsTrigger value={TabEnum.FullText}>
              {TabEnum.FullText}
            </TabsTrigger>
          </TabsList>
          <TabsContent value={TabEnum.Title}>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input type="email" placeholder="Search in Title ..." />
              <Button type="submit">Search</Button>
            </div>
          </TabsContent>
          <TabsContent value={TabEnum.FullText}>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input type="email" placeholder="Search in FullText ..." />
              <Button type="submit">Search</Button>
            </div>
          </TabsContent>
        </Tabs>
        <div className="flex items-center space-x-2">
          <Switch
            checked={optionsVisible}
            onCheckedChange={setOptionsVisible}
            id="airplane-mode"
          />
          <Label htmlFor="airplane-mode">Search Options</Label>
        </div>
      </div>
      <OptionsDrawer open={optionsVisible} setOpen={setOptionsVisible} />
    </div>
  )
}

export default Page
