import { Provider } from 'jotai'
import {type PropsWithChildren } from 'react'

export const JotaiProvider = ({ children }: PropsWithChildren) => 
  <Provider>{children}</Provider>

