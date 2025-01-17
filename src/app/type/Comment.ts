export interface Comment {
    id?: string;
    productId: string;
    userId: string;
    comment: string;
    rating: number;
    createdAt?: Date;
    fullName: string
    avatar: string
    image_url?: string;
    expanded?: boolean;
    hidden?: boolean;
  }