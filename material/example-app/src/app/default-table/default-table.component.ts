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
  @Input() tableDataSource!: TableDataSource;

  changeParamsObservable!: Observable<any[]>;
  resultsLength = 0;
  isLoadingResults = true;
  isError = false;
  displayedColumns!: string[];

  constructor() {}

  ngOnInit(): void {
    this.displayedColumns = this.tableDataSource.columns.map(c => c.key);
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
        return this.tableDataSource.getData(this.sort, this.paginator);
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
}

export interface TableDataSource {
  getData: (sort: MatSort, paginator: MatPaginator) => Observable<TableContent>;
  defaultSort: string;
  columns: TableColumn[];
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
