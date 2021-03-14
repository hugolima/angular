import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-default-table',
  templateUrl: './default-table.component.html',
  styleUrls: ['./default-table.component.css']
})
export class DefaultTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;
  @Input() tableConfig!: TableConfig;

  changeParamsObservable!: Observable<any[]>;
  resultsLength = 0;
  isLoadingResults = true;
  isError = false;
  displayedColumns!: string[];

  initialSelection = [];
  allowMultiSelect = false;
  selection = new SelectionModel<any>(this.allowMultiSelect, this.initialSelection);

  constructor() {}

  ngOnInit(): void {
    this.displayedColumns = this.tableConfig.columns.map(c => c.key);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initDataSource();
    });
  }

  initDataSource() {
    this.changeParamsObservable = merge(this.sort.sortChange, this.paginator.page).pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        return this.tableConfig.getData(this.sort, this.paginator);
      }),
      map((data:TableContent) => {
        this.isLoadingResults = false;
        this.isError = false;
        this.resultsLength = data.total_count;
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
    this.selection.toggle(row);
    this.tableConfig.selectedRowChanged(this.selection.selected);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.paginator.pageSize;
    return numSelected == numRows;
  }

  allToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.changeParamsObservable.forEach(row => this.selection.select(row));
  }
}

export interface TableConfig {
  defaultSort: string;
  columns: TableColumn[];
  selectedRowChanged: (row:any[]) => void;
  getData: (sort: MatSort, paginator: MatPaginator) => Observable<TableContent>;
}

export interface TableColumn {
  key: string;
  label: string;
  sort?: boolean;
  getFormatted?: (data:any) => string | null;
}

export interface TableContent {
  items: any[];
  total_count: number;
}
