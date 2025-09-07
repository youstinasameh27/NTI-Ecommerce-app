export interface FaqItem {
  _id?: string;
  question: string;
  answer: string;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}
