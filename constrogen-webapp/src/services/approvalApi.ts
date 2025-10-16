import { createApprovalApi } from '@shared/services/approvalApi';
import { apiService } from './api';

export const approvalApi = createApprovalApi(apiService);

