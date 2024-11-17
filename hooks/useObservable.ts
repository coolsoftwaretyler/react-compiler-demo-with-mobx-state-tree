import { useEffect, useState } from "react";
import { IStateTreeNode, t, getSnapshot, onSnapshot } from "mobx-state-tree";

// Helper to check if a value is an MST node
function isMSTNode(value: any): value is IStateTreeNode {
  return value && typeof value === "object" && "toJSON" in value;
}

export function useObservableProperty<
  T extends IStateTreeNode,
  K extends keyof ReturnType<typeof getSnapshot<T>>
>(model: T, property: K) {
  const [value, setValue] = useState(() => {
    return model[property];
  });

  useEffect(() => {
    if (!model) return;
    const disposer = onSnapshot(model, (snapshot) => {
      if (model[property] !== value) {
        setValue(model[property]);
      }
    });
    return disposer;
  }, [model, property, value]);

  // If the value is itself an MST node, return a proxy for it
  const propertyValue = model[property];
  if (isMSTNode(propertyValue)) {
    return useObservable(propertyValue);
  }

  // If it's a function, return the function bound to the model
  if (typeof propertyValue === 'function') {
    return propertyValue.bind(model);
  }

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
