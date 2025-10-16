import { createRequisitionApi } from '@shared/services/requisitionApi';
import { apiService } from './api';

export const requisitionApi = createRequisitionApi(apiService);
export * from '@shared/services/requisitionApi';

