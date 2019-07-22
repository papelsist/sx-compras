import { createSelector } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromFeature from './reducer';


export const selectPeriodo = createSelector(
  fromFeature.getRequisicionesState,
  fromFeature.getPeriodo
);

