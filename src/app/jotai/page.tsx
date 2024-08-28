"use client";

import React from "react";
import { atom, useAtom } from "jotai";

// 创建一个存储函数的atom
const multiplyFunctionAtom = atom((get) => (x, y) => x * y);

// 创建一个用于存储结果的atom
const resultAtom = atom(0);

function Calculator() {
  const [multiplyFunction] = useAtom(multiplyFunctionAtom);
  const [result, setResult] = useAtom(resultAtom);

  const handleCalculate = () => {
    const x = 5;
    const y = 7;
    const newResult = multiplyFunction(x, y);
    setResult(newResult);
  };

  return (
    <div>
      <button onClick={handleCalculate}>Calculate 5 * 7</button>
      <p>Result: {result}</p>
    </div>
  );
}

function Page() {
  return (
    <div>
      <h1>Jotai Function Storage Example</h1>
      <Calculator />
    </div>
  );
}

export default Page;
