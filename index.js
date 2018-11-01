// @flow
import React from 'react';
import type {ComponentType} from 'react';

const TYPES = {
  LEADING_EDGE: 'leading',
  TRAILING_EDGE: 'trailing',
};
const DEFAULT_DURATION = 1000;

const Debouncer = (WrappedComponent: ComponentType<any>, config: DebouncerConfig): ComponentType<any> => {
  type DebouncedComponentProps = {
    children?: any,
  };
  type DebouncedComponentState = {};

  class DebouncedComponent extends React.PureComponent<DebouncedComponentProps, DebouncedComponentState> {
    static defaultProps: any

    constructor(props) {
      super(props);

      // Fill up all dynamic handlers using the config
      this.resolveDebounceFromConfig(config);
    }

    componentWillUnmount() {
      this.nullifyPendingActions();
    }

    _debounceTypeMap = {}

    /**
     * For each prop to be debounced, we keep a map of functions to be executed
     */
    _propHandlers = {}

    /**
     * For each prop to be debounced, we keep a map of blocked states
     */
    _blockedActions = {}

    /**
     * For each prop to be debounced, we keep a map of timeout actions.
     * This is required to clean-up on unmount.
     */
    _timeoutActions = {}

    validateConfig = (config: DebouncerConfig): void => {
      // Config is required
      if (!config) {
        throw new Error(`Config is required. Received null or undefined`);
      }

      // Props to be debounced is required
      if (!config.propTypesToDebounce) {
        throw new Error('`propTypesToDebounce` is required. Received null or undefined');
      }
    }

    resolveDebounceFromConfig = (config: DebouncerConfig): void => {
      // Populate debounceTypeMap
      this._debounceTypeMap = {
        [Debouncer.TYPE.LEADING_EDGE]: this.handleLeadingEdgeDebounce,
        [Debouncer.TYPE.TRAILING_EDGE]: this.handleTrailingEdgeDebounce,
      };

      // First we check whether we have a config.
      // We can't debounce anything if we aren't given the required configurations
      this.validateConfig(config);

      // We have to make sure we are always deal with an array
      // Otherwise it'll be an ugly mess of if-else conditions
      const combinedPropTypesToDebounce = [].concat(config.propTypesToDebounce);

      combinedPropTypesToDebounce.forEach((propTypeToDebounce: string) => {
        // Filling up the dynamic prop handlers with initial data
        this._propHandlers[propTypeToDebounce] = this.handleDebouncedEvent.bind(this, propTypeToDebounce);
        this._blockedActions[propTypeToDebounce] = false;
        this._timeoutActions[propTypeToDebounce] = null;
      });
    }

    safeExecutePropAction = (debouncedProp: string, ...restOfArgs: any): void => {
      const propAction = this.props[debouncedProp];

      // Make sure the property is available and it is an executable function
      if (propAction && typeof propAction === 'function') {
        propAction(...restOfArgs); // Call function with rest of arguments
      }
    }

    handleLeadingEdgeDebounce = (debouncedProp: string, duration: number, ...restOfArgs: any): void => {
      // Since this is leading edge, we execute the function now
      this.safeExecutePropAction(debouncedProp, ...restOfArgs);

      // Let's block off any more executions and register a timeout to change it back
      this._blockedActions[debouncedProp] = true;
      this._timeoutActions[debouncedProp] = setTimeout(() => {
        this._blockedActions[debouncedProp] = false;
      }, duration);
    }

    handleTrailingEdgeDebounce = (debouncedProp: string, duration: number, ...restOfArgs: any): void => {
      // Let's block off any more executions and register a timeout to change it back
      this._blockedActions[debouncedProp] = true;
      this._timeoutActions[debouncedProp] = setTimeout(() => {
        // Since this is trailing edge edge, we execute the function now
        this.safeExecutePropAction(debouncedProp, ...restOfArgs);
        this._blockedActions[debouncedProp] = false;
      }, duration);
    }

    handleDebouncedEvent = (debouncedProp: string, ...restOfArgs: any): void => {
      // Ignore if this event is already debounced and blocked
      if (!this._blockedActions[debouncedProp]) {
        const duration = config.duration || DEFAULT_DURATION;
        const type = config.type || Debouncer.TYPE.LEADING_EDGE;
        const debounceHandler = this._debounceTypeMap[type];

        // If the user entered an unrecognized type, debounceHandler will be null/undefined.
        // Throw error
        if (!debounceHandler) {
          throw new Error(`Unrecognized \`type\` given. Must be one of ${Object.values(TYPES).toLocaleString()}`);
        }

        // Let's call the debounce handler
        debounceHandler(debouncedProp, duration, ...restOfArgs);
      }
    }

    /**
     * Nullify (cleanup) pending actions
     */
    nullifyPendingActions = (): void => {
      Object
        .keys(this._timeoutActions)
        .forEach((propName) => {
          // Nullifying pending actions
          if (this._blockedActions[propName]) {
            clearTimeout(this._timeoutActions[propName]);
          }
        });
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this._propHandlers}
        >
          {this.props.children}
        </WrappedComponent>
      );
    }
  }

  DebouncedComponent.propTypes = {...(WrappedComponent.propTypes || {})};
  // $FlowFixMe
  DebouncedComponent.defaultProps = {...(WrappedComponent.defaultProps || {})};

  return DebouncedComponent;
};

/*
 * NOTE
 * Flow doesn't support using constants as types
 * https://github.com/facebook/flow/issues/4279
 *
 * So I'm repeating the type for Flow
 */

Debouncer.TYPE = TYPES;

export type DebouncerConfig = {
  duration?: number,
  propTypesToDebounce: Array<string> | string,
  type?: 'leading' | 'trailing',
};

export default Debouncer;
