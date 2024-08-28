import React, { type PropsWithChildren } from "react";
import FloatingButtonContainer from "./container";
import { Tabs } from "@/components/ui/tabs";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="box-border min-h-96 w-11/12 overflow-hidden">
      <Tabs defaultValue="account" className="">
        <FloatingButtonContainer>{children}</FloatingButtonContainer>
      </Tabs>
    </div>
  );
};

export default Layout;
