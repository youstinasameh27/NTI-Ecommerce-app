
export type ContactCategory = 'complain' | 'question';

export interface IContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  category: ContactCategory;  
}

export interface IContactRes {
  message?: string;
  data?: any;
  success?: boolean;
}
