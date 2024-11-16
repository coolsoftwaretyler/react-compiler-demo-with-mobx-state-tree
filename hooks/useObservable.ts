import { useEffect, useState } from "react";
import { IStateTreeNode, getSnapshot, onSnapshot } from "mobx-state-tree";

export function useObservableProperty<
  T extends IStateTreeNode,
  K extends keyof ReturnType<typeof getSnapshot<T>>
>(model: T, property: K) {
  const [value, setValue] = useState(() => {
    const snapshot = getSnapshot(model);
    return snapshot[property];
  });

  useEffect(() => {
    if (!model) return;

    const disposer = onSnapshot(model, (snapshot) => {
      if (snapshot[property] !== value) {
        setValue(snapshot[property]);
      }
    });

    return disposer;
  }, [model, property, value]);

  return value;
}

export function useObservable<T extends IStateTreeNode>(model: T) {
  return new Proxy({} as ReturnType<typeof getSnapshot<T>>, {
    get: (target, property) => {
      if (typeof property === "string") {
        return useObservableProperty(
          model,
          property as keyof ReturnType<typeof getSnapshot<T>>
        );
      }
      return undefined;
    },
  });
}