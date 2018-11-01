# Debouncer

This is a higher order component that can enhance any React component with a debounce effect on it's action handlers.

**NOTE** - This is intended to debounce component action handlers. This is NOT suitable to debounced search on inputs. See [usages](#usage) section for example usages.

## Installation

`yarn add react-component-action-debouncer` or `npm i react-component-action-debouncer --save`

## Usage

### Simple usage

```jsx
import {TouchableOpacity, Text} from 'react-native';
import Debouncer from 'react-component-action-debouncer';

const DebouncedTouchableOpacity = Debouncer(TouchableOpacity, {propTypesToDebounce: 'onPress'});

// When rendering use the enhanced component
<DebouncedTouchableOpacity onPress={this.handlePress}>
  <Text>
    Action Button
  </Text>
</DebouncedTouchableOpacity>
```

### Advanced usage

If you want to debounce multiple actions of the same component, you can do the following.

```jsx
import Debouncer from 'react-component-action-debouncer';
import {MultiActionCustomComponent} from '<package/path>';

const config = {
  duration: 500,
  type: Debouncer.TYPE.LEADING_EDGE,
  propTypesToDebounce: ['onActionOne', 'onActionTwo', 'onActionThree'],
};
const DebouncedMultiActionCustomComponent = Debouncer(TouchableOpacity, config);

// When rendering use the enhanced component
<DebouncedMultiActionCustomComponent
  onActionOne={this.handleActionOne}
  onActionTwo={this.handleActionTwo}
  onActionThree={this.handleActionThree}
/>
```

## Config

1. `duration` - Duration in milliseconds.  **(DEFAULT: 1000)**
   - You can configure the duration of the debounce effect.

2. `type` - Type of debounce. **(DEFAULT: Leading Edge)**
   - There are two types of debounces. `Leading Edge` and `Trailing Edge`
   - `Leading Edge` will execute the action and block subsequent executions until the given duration elapses.
   - `Trailing Edge` will execute the action after waiting for the given duration.
   - You can select either from `Debouncer.TYPE.LEADING_EDGE` or `Debouncer.TYPE.TRAILING_EDGE`

3. `propTypesToDebounce` - The props to intercept and debounce. **Required**
   - This can be a string or an array of strings. See above [advanced usage](#advanced-usage) for more details.
