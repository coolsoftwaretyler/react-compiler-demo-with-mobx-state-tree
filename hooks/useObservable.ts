import { reaction } from "mobx";
import {
  IAnyStateTreeNode,
  IStateTreeNode,
  getMembers,
  isStateTreeNode,
} from "mobx-state-tree";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

const emptyObject = {};

type ViewArgs<T> = T extends (...args: infer A) => unknown ? A : never;

class Path<T extends IAnyStateTreeNode> {
  parts: (string | symbol)[];
  args?: ViewArgs<T>;

  constructor(parts: (string | symbol)[], args?: ViewArgs<T>) {
    this.parts = parts;
    this.args = args;
  }

  toString() {
    return this.parts.join(".");
  }
}

export function useObservable<T extends IStateTreeNode>(
  model: T,
  debug?: boolean
): T {
  const [, setState] = useState(1);
  const forceRender = useCallback(() => setState((n) => -n), []);

  const pathsAccessedInRender = useRef<Set<Path<T>>>(new Set());
  pathsAccessedInRender.current = new Set();

  useLayoutEffect(() => {
    const disposer = reaction(
      function expression() {
        if (debug) {
          console.log("Paths accessed in render:");
          pathsAccessedInRender.current.forEach((path) => {
            console.log("  ", path.toString());
            if (path.args) {
              console.log("    This is a view fn, with args:", path.args);
            }
          });
        }

        for (const path of pathsAccessedInRender.current) {
          let current: IAnyStateTreeNode = model;
          for (const part of path.parts) {
            current = current[part as keyof typeof current];

            if (typeof current === "function" && path.args) {
              current = current(...path.args);
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
  }, [forceRender, model, debug]);

  function makeProxy(instance: IAnyStateTreeNode, path: (string | symbol)[]) {
    return new Proxy(emptyObject, {
      get(_, key) {
        const value = instance[key as keyof typeof instance];

        const newPath = new Path([...path, key as string]);
        pathsAccessedInRender.current.add(newPath);

        if (isStateTreeNode(value)) {
          return makeProxy(value, [...path, key]);
        }

        if (typeof value === "function") {
          const members = getMembers(instance);
          if (members.views.includes(key as string)) {
            const view = value.bind(instance);
            const argumentWatcher = (...args: ViewArgs<typeof view>) => {
              const newPath = new Path([...path, key as string], args);
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

  return makeProxy(model, []) as T;
}
