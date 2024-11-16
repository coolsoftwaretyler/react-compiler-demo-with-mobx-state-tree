import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "MobX Demo" },
    { name: "description", content: "MobX with Remix demo" },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-8 space-y-8 text-center">
        <h1 className="text-3xl font-bold mb-8">MobX State Management Demo</h1>
        
        <div className="space-y-6">
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <Link to="/hook" className="block space-y-2">
              <h2 className="text-xl font-semibold text-blue-600">useObservable Hook</h2>
            </Link>
          </div>

          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <Link to="/observer" className="block space-y-2">
              <h2 className="text-xl font-semibold text-blue-600">Observer HOC</h2>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
