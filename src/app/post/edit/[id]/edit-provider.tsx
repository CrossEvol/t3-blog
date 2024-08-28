"use client";

import React from "react";
import { createContext, type PropsWithChildren } from "react";

interface EditContextProps {
  handleSubmit: () => void;
  setHandleSubmit: (func: () => void) => void;
}

export const EditContext = createContext<EditContextProps>({
  handleSubmit: function (): void {
    throw new Error("Function not implemented.");
  },
  setHandleSubmit: function (func: Function): void {
    throw new Error("Function not implemented.");
  },
});

const EditorProvider = ({ children }: PropsWithChildren) => {
  const [handleSubmit, setHandleSubmit] = React.useState(() => {
    return () => {
      console.log("first");
    };
  });

  return (
    <EditContext.Provider
      value={{
        handleSubmit,
        setHandleSubmit,
      }}
    >
      {children}
    </EditContext.Provider>
  );
};

export default EditorProvider;
