export type Review = { rating: number; comment: string; date: string; name: string };

export type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  brand: string | null;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  warranty: string;
  shipping: string;
  availability: string;
  returnPolicy: string;
  reviews: Review[];
  images: string[];
  thumbnail: string;
};

/** The slice of a product the cart keeps on the client. Prices are re-checked on the server at checkout. */
export type CartProduct = Pick<Product, 'id' | 'title' | 'price' | 'thumbnail' | 'stock' | 'brand'>;

export type CartItem = CartProduct & { qty: number };

export type User = { id: string; name: string; email: string; passwordHash: string; createdAt: string };

export type Address = { fullName: string; phone: string; line1: string; line2: string; city: string; state: string; zip: string; country: string };

export type OrderItem = { id: number; title: string; price: number; qty: number; thumbnail: string };

export type Order = {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  address: Address;
  payment: string;
  createdAt: string;
  deliverBy: string;
};
