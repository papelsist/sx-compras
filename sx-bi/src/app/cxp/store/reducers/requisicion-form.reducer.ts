import * as fromActions from '../actions/requisicion-form.actions';

import { CuentaPorPagar } from '../../model';

import * as _ from 'lodash';

export interface FormState {
  facturasPendientes: { [id: string]: CuentaPorPagar };
  loading: boolean;
}

export const initialState: FormState = {
  facturasPendientes: {},
  loading: false
};

export function reducer(
  state = initialState,
  action: fromActions.FormActions
): FormState {
  switch (action.type) {
    case fromActions.FormActionTypes.LOAD_FACTURAS_POR_REQUISITAR: {
      return {
        ...state,
        loading: true
      };
    }
    case fromActions.FormActionTypes.LOAD_FACTURAS_POR_REQUISITAR_FAIL: {
      return {
        ...state,
        loading: false
      };
    }
    case fromActions.FormActionTypes.LOAD_FACTURAS_POR_REQUISITAR_SUCCESS: {
      const facturasPendientes = _.keyBy(action.payload, 'id');
      return {
        ...state,
        loading: false,
        facturasPendientes
      };
    }
  }
  return state;
}

export const getFacturasPorRequisitar = (state: FormState) =>
  state.facturasPendientes;

export const getRequisicionFormLoading = (state: FormState) => state.loading;
