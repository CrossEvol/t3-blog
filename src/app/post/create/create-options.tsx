import { type PropsWithOpen } from '@/common/props'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { useAtom } from 'jotai'
import { Controller } from 'react-hook-form'
import MultiSelect from '../_select/multi-select'
import SingleSelect from '../_select/single-select'
import { formAtom } from './form-atom'

interface IProps extends PropsWithOpen {
  actions?: React.ReactNode
}

const CreateOptions = ({ open, setOpen, actions }: IProps) => {
  const [form] = useAtom(formAtom)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger></PopoverTrigger>
      <PopoverContent className="min-w-96 ml-12 mt-5">
        <div className="space-y-2">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="topic">Topic</Label>
            <SingleSelect />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="tags">Tags</Label>
            <MultiSelect />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="public-or-not">Public Or Not</Label>
            <Controller
              name="published"
              control={form?.control}
              render={({ field }) => (
                <Switch
                  id="public-or-not"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
              )}
            />
          </div>
          <div>{actions}</div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default CreateOptions
