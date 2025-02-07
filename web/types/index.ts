

export type Product = {
  productId: number;
  productName?: string;
  aisleId?: number;
  aisleName?: string;
  departmentId?: number;
  departmentName?: string;
}

export type Order = {
  orderId: number;
  orderNumber?: number;
  userId?: number;
  days_since_prior_order?: number;
  date?: string; // YYYY-MM-DD
  items: Product[];
}

// export interface ProductFull extends Product {
//   aisleId?: number;
//   aisleName?: string;
//   departmentId?: number;
//   departmentName?: string;
// }

export type CartState = {
  items: Product[]
}
export type Aisle = {
  aisleId: number;
  aisleName: string;
  departmentId?: number;
  departmentName?: string;
  products?: Product[]
}
export interface Department {
  departmentId: number;
  departmentName: string;
  slug?: string;
  aisles?: Aisle[];
}

// Nextjs version 15 changed this to async, so wrap in promise now
export type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>
