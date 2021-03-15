import { TemplateRef } from "@angular/core";

export interface TableContent {
  items: any[];
  total_count: number;
}

export interface TableColumn {
  key: string;
  label: string;
  sort?: boolean;
  valueTemplate?: TemplateRef<any>,
}
