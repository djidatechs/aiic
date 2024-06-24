import {  ElementType, ReactNode } from "react";

 export enum CellFormat {
  FALSE,
  DATE,
  DURATION,
  EXIST,
  VERIFY,
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
  special_col? : {path: string , y_cn : string , n_cn:string , redirect? : string , col_extend?:boolean },
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
  fetchData: (params: FetchDataParams) => Promise<{ data: T[] , pagination : any }>;
  updateRow: (id:string|number) =>  Promise<any>;
  EditModel : ElementType;
  CreateModel : ElementType;
  ColExtendModel:ElementType;
};