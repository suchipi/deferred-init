# `@suchipi/deferred-init`

This module encapsulates the following common initialization-at-first-usage pattern:

```ts
class MyClass {
  private _element: null | HTMLDivElement;

  private _initElement() {
    this._element = /* ... do whatever it takes to get this ready... */;
  }

  methodWhichNeedsElement() {
    if (this._element === null) {
      this._initElement();
    }

    // use this._element somehow...
    console.log(this._element!.innerText);
  }

  anotherMethodWhichNeedsElement() {
    if (this._element === null) {
      this._initElement();
    }

    // use this._element somehow...
    console.log(this._element!.innerText);
  }

  aThirdMethodWhichNeedsElement() {
    if (this._element === null) {
      this._initElement();
    }

    // use this._element somehow...
    console.log(this._element!.innerText);
  }
}

```

into this:

```ts
import { deferredInit } from "@suchipi/deferred-init";

class MyClass {
  private _deferredVars = deferredInit({
    element: () => {
      const element = /* ... do whatever it takes to get this ready... */;
      return element;
    }
  })

  methodWhichNeedsElement() {
    // use this._deferredVars.element somehow...
    console.log(this._deferredVars.element.innerText);
  }

  anotherMethodWhichNeedsElement() {
    // use this._deferredVars.element somehow...
    console.log(this._deferredVars.element.innerText);
  }

  aThirdMethodWhichNeedsElement() {
    // use this._deferredVars.element somehow...
    console.log(this._deferredVars.element.innerText);
  }
}
```

> NOTE: This example uses DOM APIs, but the library works with any value, and doesn't itself depend on any DOM APIs.

## API

### deferredInit (exported function)

Given a mapping object of name-to-init-functions, create an object with the
same property keys, whose property descriptors are initially getters which
run the initializer function for that key and then replace the getter
descriptor with a standard value descriptor.

The net effect is that the first time you read a given key, its initializer
function is run to get a resulting value, and on subsequent reads, that
resulting value is re-used, without running the initializer function.

- `@param` _initializers_ — A object whose keys are arbitrary (your choice) and whose values are functions assignable to the type `() => any`, where the returned `any` type is the initialized value. The values are considered "initializer functions" which get used the first time the corresponding key is read on the object returned by [deferredInit](#deferredinit-exported-function).
- `@returns` An object with the same keys as the initializers object passed in, which run the initializer function on the first read and re-use the result on later calls.

```ts
declare function deferredInit<
  Initializers extends {
    [Key: PropertyKey]: () => any;
  },
>(
  initializers: Initializers
): { readonly [Key in keyof Initializers]: ReturnType<Initializers[Key]> };
```

### isInitialized (exported function)

Peek into an object returned by [deferredInit](#deferredinit-exported-function) and check if one of its
properties has been initialized, without causing initialization to occur.

- `@param` _deferredInitResult_ — The object returned from [deferredInit](#deferredinit-exported-function)
- `@param` _key_ — The key on the object which you want to check the initialization status of
- `@returns` A boolean indicating whether that key has been initialized yet.

```ts
declare function isInitialized<
  DeferredInitResult extends {
    [Key: PropertyKey]: any;
  },
>(
  deferredInitResult: DeferredInitResult,
  key: keyof DeferredInitResult
): boolean;
```

## License

MIT
