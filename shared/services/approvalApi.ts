import { PurchaseRequest } from '../types/purchase';
import { ApiClient } from './authApi';

export const createApprovalApi = (apiClient: ApiClient) => ({
  async getPurchaseRequestList(endpoint: string): Promise<PurchaseRequest[]> {
    try {
      const res = await apiClient.get<{ data?: PurchaseRequest[] }>(endpoint);
      // Handle different response structures
      if (res && Array.isArray(res)) {
        return res as PurchaseRequest[];
      }
      if (res && (res as any).data && Array.isArray((res as any).data)) {
        return (res as any).data as PurchaseRequest[];
      }
      return res as unknown as PurchaseRequest[];
    } catch (error: any) {
      console.error('Error in getPurchaseRequestList:', error.message);
      return [];
    }
  },

  async updatePurchaseRequest(key: number, data: Partial<PurchaseRequest>): Promise<any> {
    try {
      return await apiClient.put(`api/transaction/purchase/requisition/${key}`, data);
    } catch (error: any) {
      console.error('Error updating purchase request:', error.message);
      throw error;
    }
  },

  async approvePurchaseRequest(purchaseRequest: PurchaseRequest): Promise<any> {
    const payload = {
      ...purchaseRequest,
      status: 'A' as const,
      items: purchaseRequest.purchs_req_items,
    };
    const { key, ...rest } = payload;
    return this.updatePurchaseRequest(key, rest);
  },

  async rejectPurchaseRequest(purchaseRequest: PurchaseRequest): Promise<any> {
    const payload = {
      ...purchaseRequest,
      status: 'R' as const,
      items: purchaseRequest.purchs_req_items,
    };
    const { key, ...rest } = payload;
    return this.updatePurchaseRequest(key, rest);
  },
});

export type ApprovalApi = ReturnType<typeof createApprovalApi>;

