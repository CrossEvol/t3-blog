"use client";
import { type PropsWithChildren, useEffect, useState } from "react";

interface IProps extends PropsWithChildren {
  components: React.ReactNode;
}

export default function FabContainer({ children, components }: IProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Toggle visibility on Enter key press
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter" /*  && event.ctrlKey */) {
        if (event.ctrlKey) {
          setIsVisible((prev) => !prev);
        }
      }
    };

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        (target.tagName === "DIV" && target.classList.contains("bn-editor"))
      ) {
        setIsVisible(false); // Hide the component when focusing on input or textarea
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("focusin", handleFocusIn);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("focusin", handleFocusIn);
    };
  }, []);

  return (
    <div className="relative">
      {children}
      {isVisible && (
        <div className="fixed bottom-3/4 right-1/2 flex h-8 translate-x-1/2 flex-row items-center justify-center space-x-4">
          {components}
        </div>
      )}
    </div>
  );
}
