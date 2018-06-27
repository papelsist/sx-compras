import { AnalisisActions, AnalisisActionTypes } from '../actions';

export interface State {
  loading: boolean;
  error: string;
  filtro: {};
}

const initialState: State = {
  loading: false,
  error: '',
  filtro: {}
};

export function reducer(state = initialState, action: AnalisisActions): State {
  switch (action.type) {
    case AnalisisActionTypes.SEARCH: {
      const filtro = action.payload;
      return {
        ...state,
        loading: true,
        error: '',
        filtro
      };
    }
  }
  return state;
}
