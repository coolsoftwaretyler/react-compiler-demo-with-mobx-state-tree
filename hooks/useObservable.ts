import { reaction } from "mobx";
import { IStateTreeNode, getMembers, isStateTreeNode } from "mobx-state-tree";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

const emptyObject = {};

export function useObservable<T extends IStateTreeNode>(model: T) {
  const [, setState] = useState(1);
  const forceRender = useCallback(() => setState((n) => -n), []);

  const pathsAccessedInRender = useRef<Set<string[]>>(new Set());
  pathsAccessedInRender.current = new Set();

  useLayoutEffect(() => {
    const disposer = reaction(
      function expression() {
        //// Uncomment this to see what paths are being accessed in the render

        // console.log("Paths accessed in render:");
        // pathsAccessedInRender.current.forEach((pathParts) => {
        //   console.log("  ", pathParts.join("."));
        //   if (Array.isArray(pathParts.args)) {
        //     console.log("    This is a view fn, with args:", pathParts.args);
        //   }
        // });

        for (const pathParts of pathsAccessedInRender.current) {
          let current = model;
          for (const part of pathParts) {
            current = current[part];

            // If we are accessing a view function, we attach the args
            // to the path array so we can call the view function here
            if (
              typeof current === "function" &&
              Array.isArray(pathParts.args)
            ) {
              current = current(...pathParts.args);
            }
          }
        }

        return []; // If anything changes we want to re-render
      },
      function effect() {
        forceRender();
      },
      {
        fireImmediately: false,
      }
    );

    return () => {
      disposer();
    };
  }, [forceRender, model]);

  function makeProxy(instance, path) {
    return new Proxy(emptyObject, {
      get(_, key) {
        const value = instance[key];

        const newPath = [...path, key];
        pathsAccessedInRender.current.add(newPath);

        if (isStateTreeNode(value)) {
          return makeProxy(value, [...path, key]);
        }

        if (typeof value === "function") {
          const members = getMembers(instance);
          if (members.views.includes(key)) {
            // If we are accessing a view function, we attach the args
            // to the path array so we can call the view function in the
            // reaction.

            const view = value.bind(instance);
            const argumentWatcher = (...args: any) => {
              const newPath = [...path, key];
              newPath.args = args;
              pathsAccessedInRender.current.add(newPath);
              return view(...args);
            };

            return argumentWatcher;
          } else {
            return value.bind(instance);
          }
        }

        return value;
      },
    });
  }

  return makeProxy(model, []);
}
