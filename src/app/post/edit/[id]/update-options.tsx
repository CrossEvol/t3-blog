import { type PropsWithOpen } from '@/common/props'
import { type UpdatePostForm } from '@/common/trpc-schema'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { Controller } from 'react-hook-form'
import MultiSelect from '../../_select/multi-select'
import SingleSelect from '../../_select/single-select'

interface IProps extends PropsWithOpen {
  form: UpdatePostForm
}

const UpdateOptions = ({ open, setOpen, form }: IProps) => {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger></PopoverTrigger>
      <PopoverContent className="min-w-96 ml-12 mt-5">
        <div className="space-y-2">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="topic">Topic</Label>
            <Controller
              name="topic"
              control={form?.control}
              render={({ field }) => (
                <SingleSelect
                  selectedOption={field.value}
                  setSelectedOption={field.onChange}
                />
              )}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="tags">Tags</Label>
            <Controller
              name="tags"
              control={form?.control}
              render={({ field }) => (
                <MultiSelect
                  selectedOptions={field.value}
                  setSelectedOptions={field.onChange}
                />
              )}
            />
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
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default UpdateOptions
