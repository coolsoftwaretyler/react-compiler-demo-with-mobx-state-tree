# MobX State React Compiler Demo

[Built with Remix](https://remix.run/)

## Why

[The new React Compiler presents problems for observable libraries](https://coolsoftware.dev/blog/a-path-towards-observable-values-in-react/), which tend to use an `observer` HOC to track changes. This observer will not work correctly with the new compiler.

MobX-State-Tree is exploring ways to make reactive updates remain granular, preserve the developer experience, and comply with the Rules of React through some custom hooks.

This demo repository is a Remix app with the React Compiler enabled for React 18.

## Usage

Run the dev server:

```shellscript
npm install
npm run dev
```

`localhost:5173` will show up and have two links: one for the `useObservable` hook, and one for the `observer` HOC. On either page, you should be able to click buttons to see changes (and see when certain state changes are ignored).

Then, open up [React DevTools](), and check to see [when the React Compiler is working](https://react.dev/learn/react-compiler#how-do-i-know-my-components-have-been-optimized). You'll see the `observer` HOC is *not* memoized correctly, but the `useObservable` hook *is*.

## How it works

[The important code is in `hooks/useObservable.ts`](https://github.com/coolsoftwaretyler/react-compiler-demo-with-mobx-state-tree/blob/main/hooks/useObservable.ts).

This is essentially like a [`useSyncExternalStore`](https://react.dev/reference/react/useSyncExternalStore) hook, but it knows a little more about MobX-State-Tree, so it can provide granular updates to the UI, whereas `useSyncExternalStore` would re-render the component on every change, even for unrelated properties (you can observe this behavior [in this CodeSandbox](https://codesandbox.io/p/sandbox/use-sync-external-store-mtzjy5?file=%2Fsrc%2FApp.tsx%3A8%2C22&workspaceId=bc6eb896-0c27-4f04-9c47-0f6548642233))

## TODO

- Document
- Solicit more feedback and edge cases/corner cases
- More fixes
- Consider packaging it up with MobX-State-Tree
