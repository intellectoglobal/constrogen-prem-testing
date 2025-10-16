import { createGrnApi } from '@shared/services/grnApi';
import { apiService } from './api';

export const grnApi = createGrnApi(apiService);

