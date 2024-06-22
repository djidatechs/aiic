 export enum CellFormat {
  FALSE,
  DATE,
  DURATION,
  EXIST,
 }
 export enum CellType {
  NESTED,
  SIMPLE
 }
 // Type definitions
export type Column<T> = {
  header: string;
  accessor: string;
  format : CellFormat,
  type : CellType,
};

export type FetchDataParams = {
  page: number;
  limit: number;
  orders : OrderCriteria[];
  filters: FilterCriteria[];
};

export type OrderCriteria = {
  column : string, 
  value : "asc" | "desc" | null
}
export type FilterCriteria = {
  column: string;
  value: string;
  condition: "exact" | "not" | "min" | "max";
};

export type TableProps<T> = {
  columns: Column<T>[];
  fetchData: (params: FetchDataParams) => Promise<{ data: T[] }>;
  updateData: (data: Partial<T>[]) => Promise<void>;
};