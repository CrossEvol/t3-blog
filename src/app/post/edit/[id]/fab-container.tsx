"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { type PropsWithChildren, useEffect, useState } from "react";
import { TabsEnum } from "./constants";
import PublishSelect from "./publish-select";

interface IProps extends PropsWithChildren {
  invokeSubmit: (e: React.SyntheticEvent) => void;
  pub: string;
  setPub: (value: string) => void;
  isPublishing: boolean;
}

export default function FabContainer({
  children,
  invokeSubmit,
  pub,
  setPub,
  isPublishing,
}: IProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  // Toggle visibility on Enter key press
  useEffect(() => {
    const handleKeyPress = (event: {
      preventDefault: () => void;
      key: string;
    }) => {
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
        <div className="fixed bottom-3/4 right-1/2 flex h-8 translate-x-1/2 flex-row items-center justify-center space-x-4">
          <TabsList>
            <TabsTrigger value={TabsEnum.markdown}>Markdown</TabsTrigger>
            <TabsTrigger value={TabsEnum.editor}>RichEditor</TabsTrigger>
          </TabsList>
          <Separator orientation="vertical" />
          <PublishSelect pub={pub} setPub={setPub} />
          <Separator orientation="vertical" />
          <Button
            onClick={(e) => {
              invokeSubmit(e);
            }}
          >
            {isPublishing ? "Publishing..." : "Publish"}
          </Button>
          <Separator orientation="vertical" />
          <Button className="opacity-50" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
