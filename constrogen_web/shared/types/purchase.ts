export interface PurchaseRequesItem {
  key: number;
  createddttm: string;
  items: { key: number; descr: string };
  uom: string;
  qty: string;
  unit: string | null;
  createdby: string;
  lastmodifiedby: string | null;
  lastmodifieddttm: string | null;
  pr_key: number;
  item_key: number;
  item_uom_key: number;
  company: number;
  client_id: number;
}

export interface PurchaseRequest {
  key: number;
  date: string;
  createddttm: string;
  project: { key: number; name: string; addr1: string | null };
  purchs_req_items: PurchaseRequesItem[];
  item_type: string;
  number: string;
  desc: string | null;
  status: 'P' | 'A' | 'R' | 'C';
  createdby: string;
  lastmodifiedby: string | null;
  lastmodifieddttm: string | null;
  proj_key: number;
  item_type_key: number;
  company: number;
  client_id: number;
}

export interface GRNItem {
  key: number;
  item_name: string;
  model_number: string;
  ordered_qty: string;
  received_qty: string;
  unit: string | null;
  createdby: string;
  createddttm: string | null;
  lastmodifiedby: string | null;
  lastmodifieddttm: string | null;
  hdr_key: number;
  item_key: number;
  item_uom_key: number;
  brand: string | null;
  company: number;
  client_id: number;
}

export interface GRN {
  vendor: any;
  project: any;
  key: number;
  grn_items: GRNItem[];
  grn_imgs: (string | {
    key?: number;
    image_url: string;
  })[];
  date: string;
  number: string;
  status: "P" | "PR" | "C" | "A" | "R"; // P=Pending, PR=Partially Received, C=Closed, A=Approved, R=Rejected
  comments: string;
  createdby: string;
  createddttm: string | null;
  lastmodifiedby: string | null;
  lastmodifieddttm: string | null;
  po_key: number;
  pr_number: number;
  company_id: number;
  client_id: number;
}

// Utility function for status colors
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'P':
      return '#FFA500'; // Pending - Orange
    case 'A':
      return '#4CAF50'; // Approved - Green
    case 'R':
      return '#F44336'; // Rejected - Red
    case 'C':
      return '#2196F3'; // Closed - Blue
    default:
      return '#9E9E9E'; // Unknown - Gray
  }
};

export const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'P':
      return 'Pending';
    case 'A':
      return 'Approved';
    case 'R':
      return 'Rejected';
    case 'C':
      return 'Closed';
    default:
      return 'Unknown';
  }
};

