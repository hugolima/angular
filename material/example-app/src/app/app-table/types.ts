import { TemplateRef } from "@angular/core";

export interface TableContent {
  total_count: number;
  items: TableItem[];
}

export interface TableItem {
  id: string;
}

export interface TableColumn {
  key: string;
  label: string;
  sort?: boolean;
  valueTemplate?: TemplateRef<any>,
}
