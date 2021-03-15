import { Component, ContentChild, Input, TemplateRef } from "@angular/core";
import { TableColumn } from "./types";

@Component({
  selector: 'app-column',
  template: ''
})
export class ColumnComponent implements TableColumn {
  @Input()
  public key!: string;

  @Input()
  public label!: string;

  @Input()
  public sort?: boolean = false;

  @ContentChild('template')
  public valueTemplate?: TemplateRef<any>;
}