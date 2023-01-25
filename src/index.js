import { defaults } from './defaults';
import { getType, datasetToObject, merge } from './helpers';
import { StarRating } from './core';

export default class Rating {
  constructor(selector, config = {}) {
    this.selector = selector;
    this.config = config;
    this.instances = [];
    this.build();
  }

  queryElements(selector) {
    switch (getType(selector)) {
      case 'HTMLSelectElement': return [selector];
      case 'NodeList': return [...selector];
      case 'String': return [...document.querySelectorAll(selector)];
      default: return [];
    }
  }

  build() {
    this.queryElements(this.selector).forEach(elem => {
      if (elem.tagName === 'SELECT') {
        const config = merge({}, defaults, this.config, datasetToObject(elem));
        this.instances.push(new StarRating(elem, config));
      }
    });
  }

  destroy() {
    this.instances.forEach(instance => instance.destroy());
    this.instances = [];
  }

  rebuild() {
    this.destroy();
    this.build();
  }

  reset() {
    this.instances.forEach(instance => instance.reset());
  }
}
