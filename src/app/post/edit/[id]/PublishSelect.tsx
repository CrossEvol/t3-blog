"use client";

import Select from "react-select";

export const options = [
  { value: true, label: "Publish" },
  { value: false, label: "Private" },
];

interface Props {
  selectedOption:
    | {
        value: boolean;
        label: string;
      }
    | undefined;
  setSelectedOption: React.Dispatch<
    React.SetStateAction<
      | {
          value: boolean;
          label: string;
        }
      | undefined
    >
  >;
}

const PublishButton = ({ selectedOption, setSelectedOption }: Props) => {
  return (
    <div className="App">
      <Select
        defaultValue={selectedOption}
        //@ts-expect-error, needed optional metadata
        onChange={setSelectedOption}
        options={options}
      />
    </div>
  );
};

export default PublishButton;
