# Debouncer

This is a higher order component that can enhance any React component with a debounce effect on it's action handlers.

**NOTE** - This is intended to debounce component action handlers. This is NOT suitable to something like a debounced search on input change. See [usages](#usage) section for example usages.

## Inspiration

I got tired of testers rapidly pressing buttons and claiming they "broke" the app. So I created this debouncer to clean out erratic presses without glitching the UI.

## Installation

`yarn add react-component-action-debouncer` or `npm i react-component-action-debouncer --save`

## Usage

### Simple usage

```jsx
import Debouncer from 'react-component-action-debouncer';
import {SingleActionCustomComponent} from '<component/path>';

const DebouncedSingleActionCustomComponent = Debouncer(SingleActionCustomComponent, 'onAction');

// When rendering use the enhanced component
<DebouncedSingleActionCustomComponent onAction={this.handleAction} />
```

### Advanced usage

If you want more control over the debounce effect (debounce multiple actions of the same component or change the duration), you can do the following.

```jsx
import Debouncer from 'react-component-action-debouncer';
import {SingleActionCustomComponent, MultiActionCustomComponent} from '<component/path>';

const singleActionConfig = {
  duration: 800,
  type: Debouncer.TYPE.TRAILING_EDGE,
  propTypesToDebounce: 'onAction',
};
const DebouncedSingleActionCustomComponent = Debouncer(SingleActionCustomComponent, singleActionConfig);
const multiActionConfig = {
  duration: 500,
  type: Debouncer.TYPE.LEADING_EDGE,
  propTypesToDebounce: ['onActionOne', 'onActionTwo', 'onActionThree'],
};
const DebouncedMultiActionCustomComponent = Debouncer(MultiActionCustomComponent, multiActionConfig);

// When rendering use the enhanced components
<DebouncedSingleActionCustomComponent onAction={this.handleAction} />
<DebouncedMultiActionCustomComponent
  onActionOne={this.handleActionOne}
  onActionTwo={this.handleActionTwo}
  onActionThree={this.handleActionThree}
/>
```

## Config

If you want a simple debounce effect on one action handler of a component, config can be the action name. See [simple usage](#simple-usage).
Or config can be an object with the following properties which gives you better control of the debounce effect.

```
{
  // ** REQUIRED **
  // The prop names to intercept and add debounce effect
  // Can be a string (for single action) or an array of strins (for multiple actions)
  propTypesToDebounce: string | Array<string>,

  // Debounce duration in milliseconds (DEFAULT: 1000)
  duration: number,

  // Type of debounce (Default: Debouncer.TYPE.LEADING_EDGE)
  // We support two types of debounces. Leading Edge and Trailing Edge
  // `Leading Edge` will execute the action and block subsequent executions until the given `duration` elapses.
  // `Trailing Edge` will debounce the execution each time the action happens and executes it after the `duration` passes without any more callback calls
  // 'THROTTLE' will will execute the action after waiting for the `duration` to elapse blocking executions during this time.
  type: Debouncer.TYPE.LEADING_EDGE | Debouncer.TYPE.TRAILING_EDGE | Debouncer.TYPE.THROTTLE,
}
```

### TODO
- [ ] Write tests
