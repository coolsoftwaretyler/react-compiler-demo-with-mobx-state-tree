import { t } from "mobx-state-tree";

const SubModel = t
  .model("SubModel", {
    title: "Hello World",
  })
  .actions((sub) => ({
    randomize() {
      console.log("Randomizing title - should render");
      const randomString = Array.from({ length: 8 }, () =>
        "Hello World".charAt(Math.random() * 10)
      ).join("");
      sub.title = randomString;
    },
  }))
  .views((self) => ({
    get allCaps() {
      return self.title.toUpperCase();
    },
    lowercase() {
      return self.title.toLowerCase();
    },
    shift(spaces: number) {
      return self.title.slice(spaces);
    }
  }))

const SomeModel = t
  .model("SomeModel", {
    count: 0,
    shouldNotBeObserved: "Do not render here",
    submodel: t.optional(SubModel, { title: "Hello World" }),
  })
  .actions((self) => ({
    increment() {
      console.log("Incrementing count - should render");
      self.count += 1;
    },
    decrement() {
      console.log("Decrementing count - should render");
      self.count -= 1;
    },
    changeNonObservedProperty() {
      console.log("Changing ignored property - should not render");
      self.shouldNotBeObserved = Math.random().toString();
    },
  }));

export const store = SomeModel.create();
