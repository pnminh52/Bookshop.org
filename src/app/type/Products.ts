export interface Product {
  id: string;
  title: string;
  price: number;
  price_after_discount: number;
  category: string;
  author: string;
  description: string;
  image_url: string;
  rating: number;
  reviews: {
    user_id: string;
    comment: string;
    rating: number;
  }[];
  discount: number;
  stock: number;
  category_id: string;
  publish_date: string;
  quantity:number;
  createdAt?: Date;
  type:string;
}