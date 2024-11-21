import { useEffect, useState } from "react";
import { IStateTreeNode, getSnapshot, onSnapshot } from "mobx-state-tree";

// Helper to check if a value is an MST node
function isMSTNode(value: unknown): value is IStateTreeNode {
  return Boolean(value && typeof value === "object" && "toJSON" in value);
}

export function useObservable<T extends IStateTreeNode>(model: T) {
  type SnapshotType = ReturnType<typeof getSnapshot<T>>;
  
  // Track observed properties and their values
  const [observedProps, setObservedProps] = useState<Record<string | symbol, unknown>>({});

  useEffect(() => {
    if (!model) return;
    
    const disposer = onSnapshot(model, () => {
      // Update only the observed properties
      setObservedProps(prev => {
        const next = { ...prev };
        let hasChanges = false;
        
        for (const prop of Object.keys(prev)) {
          const newValue = model[prop as keyof T];
          if (prev[prop] !== newValue) {
            next[prop] = newValue;
            hasChanges = true;
          }
        }
        
        return hasChanges ? next : prev;
      });
    });
    
    return disposer;
  }, [model]);

  return new Proxy({} as SnapshotType, {
    get: (target, property: string | symbol) => {
      // Add property to observed props if it's not already there
      if (!(property in observedProps)) {
        setObservedProps(prev => ({
          ...prev,
          [property]: model[property as keyof T]
        }));
        
        // Return the initial value
        const propertyValue = model[property as keyof T];
        
        if (typeof propertyValue === 'function') {
          return propertyValue.bind(model);
        }
        
        if (isMSTNode(propertyValue)) {
          return new Proxy({} as ReturnType<typeof getSnapshot<typeof propertyValue>>, {
            get: (target, nestedProperty: string | symbol) => {
              const nestedValue = propertyValue[nestedProperty as keyof typeof propertyValue];
              if (typeof nestedValue === 'function') {
                return nestedValue.bind(propertyValue);
              }
              return nestedValue;
            },
          });
        }
        
        return propertyValue;
      }

      // Return the cached value for observed properties
      const propertyValue = model[property as keyof T];
      
      if (typeof propertyValue === 'function') {
        return propertyValue.bind(model);
      }
      
      if (isMSTNode(propertyValue)) {
        return new Proxy({} as ReturnType<typeof getSnapshot<typeof propertyValue>>, {
          get: (target, nestedProperty: string | symbol) => {
            const nestedValue = propertyValue[nestedProperty as keyof typeof propertyValue];
            if (typeof nestedValue === 'function') {
              return nestedValue.bind(propertyValue);
            }
            return nestedValue;
          },
        });
      }
      
      return observedProps[property];
    }
  });
}
