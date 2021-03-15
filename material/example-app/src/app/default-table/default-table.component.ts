import { SelectionModel } from '@angular/cdk/collections';
import { AfterContentInit, AfterViewInit, Component, ContentChildren, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ColumnComponent } from './column.component';
import { TableColumn, TableContent } from './types';

@Component({
  selector: 'app-default-table',
  templateUrl: './default-table.component.html',
  styleUrls: ['./default-table.component.css']
})
export class DefaultTableComponent implements AfterViewInit, AfterContentInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;
  @ContentChildren(ColumnComponent) columns!: TableColumn[];

  @Input() getData!: (sort: MatSort, paginator: MatPaginator) => Observable<TableContent>;
  @Input() defaultSort!: string;
  @Input() allowMultiSelect: boolean = false;
  @Input() showCheckbox: boolean = false;

  @Output() onRowSelect = new EventEmitter();
  @Output() onRowUnselect = new EventEmitter();

  changeParamsObservable!: Observable<any[]>;
  itemsCopy:any = [];
  resultsLength = 0;
  isLoadingResults = true;
  isError = false;
  displayedColumns!: string[];
  initialSelection: SelectionModel<any>[] = [];
  selection!: SelectionModel<any>;

  constructor() {}

  ngAfterViewInit(): void {
    this.initDataSource();
  }

  ngAfterContentInit(): void {
    this.displayedColumns = this.columns.map((c:TableColumn) => c.key);
    this.selection = new SelectionModel<any>(this.allowMultiSelect, this.initialSelection);

    if (this.showCheckbox) {
      this.displayedColumns.unshift('chkBoxSelect');
    }
  }

  initDataSource() {
    this.changeParamsObservable = merge(this.sort.sortChange, this.paginator.page).pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        return this.getData(this.sort, this.paginator);
      }),
      map((data:TableContent) => {
        this.isLoadingResults = false;
        this.isError = false;
        this.resultsLength = data.total_count;
        this.itemsCopy = data.items;
        return data.items;
      }),
      catchError(() => {
        this.isLoadingResults = false;
        this.isError = true;
        return observableOf([]);
      })
    );

    this.table.dataSource = this.changeParamsObservable;
  }

  resetPaging(): void {
    this.paginator.pageIndex = 0;
  }

  toggleSelection(row:any) {
    this.selection.toggle(row.id);
    if (this.selection.isSelected(row.id)) {
      this.onRowSelect.emit(row);
    } else {
      this.onRowUnselect.emit(row);
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.paginator.pageSize;
    return numSelected == numRows;
  }

  allToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.itemsCopy.forEach((row:any) => this.selection.select(row.id));
  }
}
