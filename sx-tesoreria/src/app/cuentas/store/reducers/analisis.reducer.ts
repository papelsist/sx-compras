import { SaldoActions } from '../actions/saldos.actions';

import { CuentaDeBanco } from 'app/models';

export interface State {
  selected: CuentaDeBanco;
}

export const initialState: State = {
  selected: undefined
};

export function reducer(state = initialState, action: SaldoActions): State {
  switch (action.type) {
    default: {
      return state;
    }
  }
}
