"use client";

import { useState } from "react";

const Page = () => {
    const [first, setFirst] = useState(() => {
        return () => 100;
      });

  return <div>{first()}</div>;
};

export default Page;
