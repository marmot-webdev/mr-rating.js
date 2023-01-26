import { defineProperties, setAttributes } from './helpers';

export class StarRating {
  constructor(element, config) {
    this.select = element;
    this.options = [...this.select.options];
    this.config = config;
    this.clearable = this.options.some(option => !option.value && !option.disabled);
    this.direction = getComputedStyle(this.select).getPropertyValue('direction');
    this.events = {
      change: this.onChange.bind(this),
      keydown: this.onKeyDown.bind(this),
      pointerdown: this.onPointerDown.bind(this),
      pointerleave: this.onPointerLeave.bind(this),
      pointermove: this.onPointerMove.bind(this),
      reset: this.onReset.bind(this)
    };
    this.resetEvent = false;

    defineProperties(this.select, {
      'disabled': value => (this.state.disabled = value),
      'value': value => (this.state.value = value)
    });

    this.init();
  }

  init() {
    this.render();

    const { disabled, index } = this.createState();

    !disabled && this.handleEvents('add');
    this.applySelection(index);

    if (typeof this.config.onInit === 'function') {
      this.config.onInit(this.select);
    }
  }

  destroy() {
    this.reset(false);
    this.state = this.initialState = null;
    this.handleEvents('remove');
    this._select.remove();
    defineProperties(this.select, {'disabled': null, 'value': null});

    if (typeof this.config.onDestroy === 'function') {
      this.config.onDestroy(this.select);
    }
  }

  reset(callback = true) {
    ['disabled', 'value'].forEach(key => {
      const value = this.initialState[key];

      if (this.select[key] !== value) {
        this.select[key] = value;
      }
    });

    if (callback && typeof this.config.onReset === 'function') {
      this.config.onReset(this.select);
    }
  }

  applySelection(index, force) {
    const isNewTarget = force || index !== -1;
    const { activeClass, selectedClass } = this.config.classList;
    const i = index + 1;

    this._select.dataset.rating = i;
    this._select.style.setProperty('--i', i);

    if (this.config.tooltip) {
      const tooltip = this._options[index]?.dataset.text || this.select.querySelector('[value=""]').text;
      this._select.dataset.tooltip = tooltip;
    }

    this._options.forEach((option, i) => {
      option.classList.toggle(activeClass, isNewTarget && i <= index);
      option.classList.toggle(selectedClass, isNewTarget && i === index);
      option.setAttribute('aria-selected', isNewTarget && i === index);
    });

    this.indexActive = index;
  }

  getIndex(value) {
    return this._options.findIndex(option => option.dataset.value === value);
  }

  createState() {
    const { disabled, value } = this.select;

    this.initialState = {
      disabled: disabled,
      index: this.getIndex(value),
      value: value
    };

    return this.state = new Proxy({...this.initialState}, {
      get: (target, prop) => target[prop],
      set: (target, prop, value) => {
        if (target[prop] === value) return true;

        target[prop] = value;

        if (prop === 'disabled') {
          this.handleEvents(value ? 'remove' : 'add', this.resetEvent);
        }

        if (prop === 'index') {
          target.value = this._options[value]?.dataset.value || '';
        }

        if (prop === 'value') {
          target.index = this.getIndex(value);
        }

        this.applySelection(target.index);

        return true;
      }
    });
  }

  createContainer() {
    const container = document.createElement('ul');
    const { containerClass } = this.config.classList;
    const { label, orientation } = this.config;
    const items = this.createItems();

    containerClass && container.classList.add(...containerClass.trim().split(' '));

    setAttributes(container, {
      'aria-label': this.select.getAttribute('aria-label') || label,
      'aria-orientation': orientation,
      role: 'listbox'
    }, false);

    container.style.setProperty('--n', items.length);
    container.append(...items);

    return { container, items };
  }

  createItems() {
    const item = document.createElement('li');
    const { itemClass } = this.config.classList;
    const { icon } = this.config;

    itemClass && item.classList.add(...itemClass.trim().split(' '));

    setAttributes(item, {
      'aria-selected': false,
      'role': 'option'
    }, false);

    if (icon) {
      item.innerHTML = icon;
    }

    return this.options
      .filter(option => option.value)
      .map((option, i) => {
        const clone = item.cloneNode(true);

        setAttributes(clone, {...option.dataset, ...{
          index: i,
          value: option.value,
          text: option.text,
        }});

        if (typeof this.config.items === 'function') {
          this.config.items(clone, i);
        }

        return clone;
      });
  }

  render() {
    const { container, items } = this.createContainer();

    this.select.insertAdjacentElement('afterend', container);
    this._select = container;
    this._options = items;
  }

  eventListener(elem, action, events) {
    events.forEach(event => elem[action + 'EventListener'](event, this.events[event]));
  }

  handleEvents(action, resetEvent = false) {
    const { form } = this.select;

    if (form && !resetEvent) {
      this.eventListener(form, action, ['reset']);
      this.resetEvent = action === 'remove' ? false : true;
    }

    this.eventListener(this.select, action, ['change', 'keydown']);
    this.eventListener(this._select, action, ['pointerdown', 'pointerleave', 'pointermove']);
  }

  onChange(e) {
    if (e.isTrusted) {
      this.state.value = e.target.value;
    }

    if (typeof this.config.onSelect === 'function') {
      this.config.onSelect(this.select);
    }
  }

  onKeyDown(e) {
    // TODO: add rtl support
  }

  onPointerDown(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    const elem = e.target.closest('[role="option"]');

    if (!elem) return;

    const { index, value } = elem.dataset;
    const isSame = +index === this.state.index;

    if (!this.clearable && isSame) {
      return;
    }

    this.select.value = this.clearable && isSame ? '' : value;
    this.select.dispatchEvent(new Event('change'));
  }

  onPointerLeave(e) {
    const { index } = this.state;

    if (index !== this.indexActive) {
      this.applySelection(index, true);
    }
  }

  onPointerMove(e) {
    const elem = e.target.closest('[role="option"]');

    if (!elem) return;

    const index = +elem.dataset.index;

    if (index !== this.indexActive) {
      this.applySelection(index, true);
    }
  }

  onReset(e) {
    this.reset();
  }
}
