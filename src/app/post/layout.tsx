import { Tabs } from '@/components/ui/tabs'
import { type PropsWithChildren } from 'react'
import { TabsEnum } from './constants'

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="box-border min-h-96 w-11/12 overflow-hidden">
      <Tabs defaultValue={TabsEnum.markdown} className="">
        {children}
      </Tabs>
    </div>
  )
}

export default Layout
