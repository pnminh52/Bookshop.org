export interface Comment {
    id?: string;
    productId: string;
    userId: string;
    comment: string;
    rating: number;
    createdAt?: Date;
    fullName: string
    avatar: string
    imageUrl?: string;
    expanded?: boolean;
  }