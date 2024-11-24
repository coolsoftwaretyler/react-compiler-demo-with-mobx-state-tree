import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "MobX State Tree Demo" },
    { name: "description", content: "MobX State Tree Demo" },
  ];
};

export default function Index() {
  return (
    <div className="bg-white min-h-screen p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">MobX State Tree Demo</h1>
      <div className="space-y-6">
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Choose your implementation:</h2>
          <div className="space-y-4">
            <Link 
              to="/observer" 
              className="block p-4 bg-green-50 hover:bg-green-100 rounded-md border border-green-200 text-green-700"
            >
              👀 Observer HOC Implementation
            </Link>
            <Link 
              to="/hook" 
              className="block p-4 bg-purple-50 hover:bg-purple-100 rounded-md border border-purple-200 text-purple-700"
            >
              🪝 Hook Implementation
            </Link>
            <Link 
              to="/state" 
              className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 text-blue-700"
            >
              ⚛️ React State Implementation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
