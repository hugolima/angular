import { Component, ContentChild, Input, TemplateRef } from "@angular/core";

@Component({
  selector: 'default-column',
  template: ''
})
export class ColumnComponent {
  @Input()
  public key!: string;

  @Input()
  public label!: string;

  @Input()
  public sort?: boolean = false;

  @ContentChild('template')
  public valueTemplate?: TemplateRef<any>;
}