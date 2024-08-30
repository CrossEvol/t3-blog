import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { DatePickerWithPresets } from './date-picker'
import { Input } from '@/components/ui/input'

const OptionsForm = () => {
  return (
    <div className="m-4 space-y-1">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="searchText">SearchText</Label>
        <Input disabled type="text" id="searchText" placeholder="SearchText" />
      </div>
      <div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="topic">Topic</Label>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a Topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="tag">Tag</Label>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a Tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="airplane-mode" />
        <Label htmlFor="airplane-mode">Published</Label>
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="date">Date</Label>
        <DatePickerWithPresets />
      </div>
    </div>
  )
}

export default OptionsForm
