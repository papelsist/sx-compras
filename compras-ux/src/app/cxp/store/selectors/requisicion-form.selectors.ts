import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromRequisicionForm from '../reducers/requisicion-form.reducer';

export const getRequisicionFormState = createSelector(
  fromFeature.getCxpState,
  (state: fromFeature.CxpState) => state.requisicionForm
);

export const getFacturasPorRequisitarEntities = createSelector(
  getRequisicionFormState,
  fromRequisicionForm.getFacturasPorRequisitar
);

export const getAllFacturasPorRequisitar = createSelector(
  getFacturasPorRequisitarEntities,
  entities => Object.keys(entities).map(id => entities[id])
);

export const getRequisicionFormLoading = createSelector(
  getRequisicionFormState,
  fromRequisicionForm.getRequisicionFormLoading
);
