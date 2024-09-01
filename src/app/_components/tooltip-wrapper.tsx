import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { type PropsWithChildren } from 'react'

interface IProps extends PropsWithChildren {
  content: string
}

const TooltipWrapper = ({ children, content }: IProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent>
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

export default TooltipWrapper
