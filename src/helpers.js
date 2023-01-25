export const getType = value => Object.prototype.toString.call(value).slice(8, -1);

export const isObject = value => getType(value) === 'Object';

export const datasetToObject = elem => Object.entries(elem.dataset)
  .reduce((obj, [key, value]) => (obj[key] = getData(value), obj), {});

export function merge(target, ...sources) {
  if (!sources.length) {
    return target;
  }

  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const [key, value] of Object.entries(source)) {
      target[key] = isObject(value) ? merge(target[key] || {}, value) : value;
    }
  }

  return merge(target, ...sources);
}

export function defineProperties(obj, properties) {
  const props = {};

  for (const [key, action] of Object.entries(properties)) {
    const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(obj), key);

    props[key] = {
      get() {
        return descriptor.get.call(obj);
      },
      set(value) {
        descriptor.set.call(obj, value);

        if (typeof action === 'function') {
          action(value);
        }
      },
      configurable: true,
      enumerable: true
    };
  }

  Object.defineProperties(obj, props);
}

export function setAttributes(elem, attrs, isDataset = true) {
  const fn = isDataset ?
    ([key, value]) => (elem.dataset[key] = value) :
    ([key, value]) => elem.setAttribute(key, value);

  Object.entries(attrs).forEach(fn);
}

// https://github.com/jquery/jquery/blob/main/src/data.js#L20
export function getData(data) {
  if (data === 'true') {
    return true;
  }

  if (data === 'false') {
    return false;
  }

  if (data === 'null') {
    return null;
  }

  if (data === `${+data}`) {
    return +data;
  }

  if (/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/.test(data)) {
    return JSON.parse(data);
  }

  return data;
}
