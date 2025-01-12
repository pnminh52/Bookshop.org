export interface Comment {
    id?: string;
    productId: string;
    userId: string;
    comment: string;
    rating: number;
    createdAt?: Date;
  }