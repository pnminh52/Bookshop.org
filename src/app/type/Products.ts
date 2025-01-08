export interface Product {
  id: string;
  title: string;
  price: string;
  price_after_discount: string;
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
}