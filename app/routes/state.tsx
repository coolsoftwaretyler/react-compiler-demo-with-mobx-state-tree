import type { MetaFunction } from "@remix-run/node";
import { useState, useMemo, useCallback } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "React State" },
    { name: "description", content: "React State Management" },
  ];
};

export default function StatePage() {
  const [count, setCount] = useState(0);
  const [title, setTitle] = useState("Hello World");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [shouldNotBeObserved, setShouldNotBeObserved] = useState("Do not render here");

  // Equivalent to MST computed view
  const allCaps = useMemo(() => title.toUpperCase(), [title]);

  // Equivalent to MST lazily evaluated view
  const lowercase = useCallback(() => title.toLowerCase(), [title]);

  // Equivalent to MST lazily evaluated view
  const shift = useCallback((spaces: number) => title.slice(spaces), [title]);

  console.log("Rendering");

  const increment = () => {
    console.log("Incrementing count - should render");
    setCount(prev => prev + 1);
  };

  const decrement = () => {
    console.log("Decrementing count - should render");
    setCount(prev => prev - 1);
  };

  const changeNonObservedProperty = () => {
    console.log("Changing ignored property - should not render");
    setShouldNotBeObserved(Math.random().toString());
  };

  const randomizeTitle = () => {
    console.log("Randomizing title - should render");
    const randomString = Array.from({ length: 8 }, () =>
      "Hello World".charAt(Math.random() * 10)
    ).join("");
    setTitle(randomString);
  };

  return (
    <div className="App bg-white p-8 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">⚛️ Using React useState ⚛️</h1>
      <p className="text-gray-800">Open up React DevTools and you&apos;ll see this component in the tree</p>
      <p className="text-gray-800 my-2">
        {count}: {title}
      </p>
      <p className="text-gray-800 my-2">This is a memoized value that capitalizes the title: {allCaps}</p>
      <p className="text-gray-800 my-2">This is a lazily evaluated view that converts the title to lowercase: {lowercase()}</p>
      <p className="text-gray-800 my-2">This is a lazily evaluated view that shifts the title by a variable amount (set to 2): {shift(2)}</p>
      <div className="flex flex-wrap gap-2">
        <button 
          onClick={increment} 
          className="px-4 py-2 text-white font-semibold rounded-md bg-blue-500 hover:bg-blue-600 transition-colors"
        >
          +
        </button>
        <button 
          onClick={decrement} 
          className="px-4 py-2 text-white font-semibold rounded-md bg-red-500 hover:bg-red-600 transition-colors"
        >
          -
        </button>
        <button
          onClick={changeNonObservedProperty}
          className="px-4 py-2 text-white font-semibold rounded-md bg-purple-500 hover:bg-purple-600 transition-colors"
        >
          We do not observe the property this changes
        </button>
        <button
          onClick={randomizeTitle}
          className="px-4 py-2 text-white font-semibold rounded-md bg-green-500 hover:bg-green-600 transition-colors"
        >
          Randomize string
        </button>
      </div>
    </div>
  );
}
