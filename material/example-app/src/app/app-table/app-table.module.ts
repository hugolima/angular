import { NgModule } from '@angular/core';

import { AppTableComponent } from './app-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { ColumnComponent } from './column.component';

@NgModule({
  declarations: [
    AppTableComponent,
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
    AppTableComponent,
    ColumnComponent,
  ]
})
export class AppTableModule { }
