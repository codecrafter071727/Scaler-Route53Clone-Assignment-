export type Paginated<T> = {
  items: T[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
};

export type PageParams = {
  page?: number;
  page_size?: number;
};

export const DEFAULT_PAGE_SIZE = 20;
