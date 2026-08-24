export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  categoryId: number;
  rating: number;
  sales: number;
  tags?: string[];
  isFlashSale?: boolean;
  flashSalePrice?: number;
  flashSaleEndTime?: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  parentId?: number;
  children?: Category[];
}

export interface CartItem {
  productId: number;
  quantity: number;
  selected: boolean;
}

export interface SearchHistoryItem {
  keyword: string;
  timestamp: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
}
