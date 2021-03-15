import { NgModule } from '@angular/core';

import { DefaultTableComponent } from './default-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { ColumnComponent } from './column.component';

@NgModule({
  declarations: [
    DefaultTableComponent,
    ColumnComponent,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    DefaultTableComponent,
    ColumnComponent,
  ]
})
export class DefaultTableModule { }
