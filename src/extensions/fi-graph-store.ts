// @ts-ignore
import { extensionSpec, ImmutableObject, IMState } from 'jimu-core';
import { WidgetState } from '../config';

export enum ActionKeys {
  SetFilters = 'SET_FILTERS',
}

export interface SetFilters {
  type: ActionKeys.SetFilters;
  val: string;
}

type ActionTypes = SetFilters;
type IMWidgetState = ImmutableObject<WidgetState>;

// @ts-ignore
declare module 'jimu-core/lib/types/state' {
  interface State {
    widgetState?: IMWidgetState;
  }
}

export default class MyReduxStoreExtension implements extensionSpec.ReduxStoreExtension {
  id = 'my-local-redux-store-extension';

  getActions() {
    return Object.keys(ActionKeys).map(k => ActionKeys[k]);
  }

  getInitLocalState() {
    return {
      filters: null
    }
  }

  getReducer() {
    return (localState: IMWidgetState, action: ActionTypes, appState: IMState): IMWidgetState => {
      switch (action.type) {
        case ActionKeys.SetFilters:
          return localState.set('filters', action.val);
        default:
          return localState;
      }
    }
  }

  getStoreKey() {
    return 'widgetState';
  }
}