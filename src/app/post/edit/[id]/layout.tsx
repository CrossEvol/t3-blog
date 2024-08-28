import { Tabs } from "@/components/ui/tabs";
import { type PropsWithChildren } from "react";
import { TabsEnum } from "./constants";
import FloatingButtonContainer from "./container";
import EditorProvider from "./edit-provider";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="box-border min-h-96 w-11/12 overflow-hidden">
      <EditorProvider>
        <Tabs defaultValue={TabsEnum.markdown} className="">
          <FloatingButtonContainer>{children}</FloatingButtonContainer>
        </Tabs>
      </EditorProvider>
    </div>
  );
};

export default Layout;
