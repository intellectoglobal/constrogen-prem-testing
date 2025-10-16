import { GRN } from '../types/purchase';
import { ApiClient } from './authApi';

export const createGrnApi = (apiClient: ApiClient) => ({
  async getGRNList(endpoint: string): Promise<GRN[]> {
    try {
      const res = await apiClient.get<GRN[]>(endpoint);
      return (res as any).data || res as GRN[];
    } catch (error: any) {
      console.error('Error in getGRNList:', error.message);
      return [];
    }
  },

  async updateGRN(grnId: number, grnData: Partial<GRN>): Promise<GRN> {
    try {
      console.log('Updating GRN:', grnData);
      const res = await apiClient.put(`api/transaction/grn/${grnId}/`, grnData);
      return (res as any).data || res as GRN;
    } catch (error: any) {
      console.error('Error in updateGRN:', error);
      throw error;
    }
  },
});

export type GrnApi = ReturnType<typeof createGrnApi>;

