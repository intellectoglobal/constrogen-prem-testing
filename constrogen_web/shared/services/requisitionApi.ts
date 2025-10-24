import { ApiClient } from './authApi';

export interface Project {
  key: number;
  name: string;
  descr?: string;
}

export interface ItemType {
  key: number;
  descr: string;
}

export interface Item {
  key: number;
  descr: string;
}

export interface UOM {
  key: number;
  descr: string;
}

export interface RequisitionItem {
  item_key: number;
  name: string;
  qty: string;
  item_uom_key: number;
  uom: string;
  unitPrice?: string;
  totalPrice?: string;
}

export interface RequisitionData {
  proj_key: number;
  item_type_key: number;
  docid: string;
  number: number;
  stage?: string;
  requiredDate?: string;
  notes?: string;
  items: RequisitionItem[];
}

export const createRequisitionApi = (apiClient: ApiClient) => ({
  async getProjects(): Promise<Project[]> {
    try {
      const res = await apiClient.get<Project[]>('api/project/project/all/active');
      return (res as any).data || res as Project[];
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },

  async getItemTypes(): Promise<ItemType[]> {
    try {
      const res = await apiClient.get<ItemType[]>('api/inventory/item_type/?without_pagination=1');
      return (res as any).data || res as ItemType[];
    } catch (error: any) {
      console.error('Error fetching item types:', error);
      return [];
    }
  },

  async getItems(itemTypeKey: number): Promise<Item[]> {
    try {
      const res = await apiClient.get<Item[]>(`api/inventory/item/?item_types=${itemTypeKey}&without_pagination=1`);
      return (res as any).data || res as Item[];
    } catch (error: any) {
      console.error('Error fetching items:', error);
      return [];
    }
  },

  async getUOMs(itemTypeKey: number): Promise<UOM[]> {
    try {
      const res = await apiClient.get<UOM[]>(`api/inventory/item_uom/?item_type=${itemTypeKey}&without_pagination=1`);
      return (res as any).data || res as UOM[];
    } catch (error: any) {
      console.error('Error fetching UOMs:', error);
      return [];
    }
  },

  async getNextDocId(): Promise<number> {
    try {
      const res = await apiClient.get<{ next_doc_id: number }>('api/transaction/doc/id/next?docid=PR');
      const data = (res as any).data || res;
      return data.next_doc_id || 0;
    } catch (error: any) {
      console.error('Error fetching next doc ID:', error);
      return 0;
    }
  },

  async submitRequisition(data: RequisitionData): Promise<any> {
    try {
      const res = await apiClient.post('api/transaction/purchase/requisition/', data);
      return (res as any).data || res;
    } catch (error: any) {
      console.error('Error submitting requisition:', error);
      throw error;
    }
  },

  async updateRequisition(key: number, data: RequisitionData): Promise<any> {
    try {
      const res = await apiClient.put(`api/transaction/purchase/requisition/${key}`, data);
      return (res as any).data || res;
    } catch (error: any) {
      console.error('Error updating requisition:', error);
      throw error;
    }
  },
});

export type RequisitionApi = ReturnType<typeof createRequisitionApi>;

