import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IProps {
  pub: string;
  setPub: (value: string) => void;
}

const PublishSelect = ({ pub, setPub }: IProps) => {
  return (
    <div>
      <Select defaultValue={pub} onValueChange={setPub}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Public" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="public">Public</SelectItem>
          <SelectItem value="private">Private</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PublishSelect;
