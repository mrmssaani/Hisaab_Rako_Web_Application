export interface Customer {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  total: number;
  paid: number;
  notes: string;
  last_updated: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  business_name: string;
  business_type: string;
  business_phone: string;
  business_address: string;
  personal_name: string;
  personal_email: string;
  personal_phone: string;
  personal_cnic: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export type FilterTab = 'all' | 'pending' | 'cleared';
export type Language = 'en' | 'ur';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}
