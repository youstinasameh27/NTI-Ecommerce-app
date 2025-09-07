export interface CartItem {
  _id: string;                       
  product: string | { _id: string; title?: string; imgURL?: string; price?: number };
  qty: number;
  price: number;                     
}

export interface Cart {
  _id: string;
  items: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}
