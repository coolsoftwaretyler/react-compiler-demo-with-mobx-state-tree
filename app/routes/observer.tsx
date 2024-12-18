import type { MetaFunction } from "@remix-run/node";
import { observer } from "mobx-react";
import { store } from "../../store/store";

export const meta: MetaFunction = () => {
  return [
    { title: "Observer HOC" },
    { name: "description", content: "Observer HOC" },
  ];
};

export default observer(function ObserverPage() {
  const {
    count,
    submodel: { title, allCaps },
  } = store;

  console.log("Rendering")

  return (
    <div className="App bg-white p-8 min-h-screen">
      <h1 className="text-3xl font-bold text-green-600 mb-4">👀 Using MobX Observer HOC 👀</h1>
      <p className="text-gray-800">Open up React DevTools and you&apos;ll see that the `ObserverPage` component is not memoized with React Compiler</p>
      <p className="text-gray-800 my-2">
        {count}: {title}
      </p>
      <p className="text-gray-800 my-2">This is a computed view that capitalizes the title: {allCaps}</p>
      <div className="flex flex-wrap gap-2">
        <button 
          onClick={() => store.increment()} 
          className="px-4 py-2 text-white font-semibold rounded-md bg-blue-500 hover:bg-blue-600 transition-colors"
        >
          +
        </button>
        <button 
          onClick={() => store.decrement()} 
          className="px-4 py-2 text-white font-semibold rounded-md bg-red-500 hover:bg-red-600 transition-colors"
        >
          -
        </button>
        <button
          onClick={() => store.changeNonObservedProperty()}
          className="px-4 py-2 text-white font-semibold rounded-md bg-purple-500 hover:bg-purple-600 transition-colors"
        >
          We do not observe the property this changes
        </button>
        <button
          onClick={() => store.submodel.randomize()}
          className="px-4 py-2 text-white font-semibold rounded-md bg-green-500 hover:bg-green-600 transition-colors"
        >
          Randomize string
        </button>
      </div>
    </div>
  );
});
