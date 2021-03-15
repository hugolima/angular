import { TemplateRef } from "@angular/core";

export interface TableContent {
  total_count: number;
  items: any[];
}

export interface TableColumn {
  key: string;
  label: string;
  sort?: boolean;
  valueTemplate?: TemplateRef<any>,
}
