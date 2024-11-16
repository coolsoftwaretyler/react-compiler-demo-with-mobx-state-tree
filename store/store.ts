import { t } from "mobx-state-tree";

const SubModel = t
  .model("SubModel", {
    title: "Hello World",
  })
  .actions((sub) => ({
    randomize() {
      const randomString = Array.from({ length: 8 }, () =>
        "Hello World".charAt(Math.random() * 10)
      ).join("");
      sub.title = randomString;
    },
  }));

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
