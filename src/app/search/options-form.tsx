import { type SearchPostForm } from '@/common/trpc-schema'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Controller } from 'react-hook-form'
import MultiTagsSelect from './_select/multi-tags-select'
import MultiTopicsSelect from './_select/multi-topics-select'
import { DatePickerWithPresets } from './date-picker'

interface IProps {
  form: SearchPostForm
}

const OptionsForm = ({ form }: IProps) => {
  return (
    <div className="m-4 space-y-2">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="searchText">SearchText</Label>
        <Input disabled type="text" id="searchText" placeholder="SearchText" />
      </div>
      <div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="topic">Topic</Label>
          <Controller
            name="topics"
            control={form.control}
            render={({ field }) => 
              <MultiTopicsSelect
                selectedOptions={field.value!}
                setSelectedOptions={field.onChange}
              />
            }
          />
        </div>
      </div>
      <div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="tag">Tag</Label>
          <Controller
            name="tags"
            control={form.control}
            render={({ field }) => 
              <MultiTagsSelect
                selectedOptions={field.value!}
                setSelectedOptions={field.onChange}
              />
            }
          />
        </div>
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="published-or-not">Published</Label>
        <Controller
          name="published"
          control={form.control}
          render={({ field }) => 
            <Switch
              id="published-or-not"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          }
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="date">Date</Label>
        <DatePickerWithPresets form={form} />
      </div>
    </div>
  )
}

export default OptionsForm
