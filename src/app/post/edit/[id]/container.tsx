"use client";
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { type PropsWithChildren, useContext, useEffect, useState } from "react";
import { TabsEnum } from "./constants";
import { EditContext } from "./edit-provider";
import NewPublishSelect from "./new-publish-select";

export default function FloatingButtonContainer({
  children,
}: PropsWithChildren) {
  const { handleSubmit } = useContext(EditContext);
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  // Toggle visibility on Enter key press
  useEffect(() => {
    const handleKeyPress = (event: {
      preventDefault: () => void;
      key: string;
    }) => {
      event.preventDefault();
      if (event.key === "Enter") {
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="relative">
      {children}
      {isVisible && (
        <div className="fixed bottom-1/2 right-1/2 flex translate-x-1/2 flex-row items-center justify-center space-x-4">
          <TabsList>
            <TabsTrigger value={TabsEnum.markdown}>Markdown</TabsTrigger>
            <TabsTrigger value={TabsEnum.editor}>RichEditor</TabsTrigger>
          </TabsList>
          <NewPublishSelect />
          <Button
            onClick={(e) => {
              e.preventDefault();
              debugger;
              handleSubmit();
            }}
          >
            Publish
          </Button>
          <Button className="opacity-50" onClick={() => router.back()}>
            Cancel
          </Button>
          <button className=" rounded-full bg-blue-500 p-4 text-white shadow-lg hover:bg-blue-600">
            Floating Button
          </button>
        </div>
      )}
    </div>
  );
}
