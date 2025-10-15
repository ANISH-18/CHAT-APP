export interface ConversationType {
  _id: string;
  type: string;
  name: string;
  participants: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
