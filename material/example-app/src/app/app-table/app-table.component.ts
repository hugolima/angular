import { SelectionModel } from '@angular/cdk/collections';
import { AfterContentInit, AfterViewInit, Component, ContentChildren, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ColumnComponent } from './column.component';
import { TableColumn, TableContent, TableItem } from './types';

@Component({
  selector: 'app-table',
  templateUrl: './app-table.component.html',
  styleUrls: ['./app-table.component.sass']
})
export class AppTableComponent implements AfterViewInit, AfterContentInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<TableItem>;
  @ContentChildren(ColumnComponent) columns!: TableColumn[];

  @Input() getData!: (sort: MatSort, paginator: MatPaginator, searchData: any) => Observable<TableContent>;
  @Input() defaultSort!: string;
  @Input() allowMultiSelect: boolean = false;
  @Input() showCheckbox: boolean = false;

  @Output() rowSelect = new EventEmitter();
  @Output() rowUnselect = new EventEmitter();

  changeParamsObservable!: Observable<any[]>;
  rowsId: any = [];
  resultsLength = 0;
  isLoadingResults = true;
  isError = false;
  displayedColumns!: string[];
  displayedSearchColumns!: string[];
  displayMessageColumn: string[] = [];
  initialSelection: SelectionModel<any>[] = [];
  selection!: SelectionModel<any>;

  searchForm: any = {};
  private searchEvent = new EventEmitter<any>();

  constructor() {}

  ngAfterViewInit(): void {
    this.initDataSource();
  }

  ngAfterContentInit(): void {
    this.displayedColumns = this.columns.map((c:TableColumn) => c.key);
    this.displayedSearchColumns = this.columns.map((c:TableColumn) => (`${c.key}-search`));
    this.selection = new SelectionModel<any>(this.allowMultiSelect, this.initialSelection);

    this.columns.forEach((c:TableColumn) => {
      this.searchForm[c.key] = new FormControl('');
    })

    if (this.showCheckbox) {
      this.displayedColumns.unshift('chkBoxSelect');
      this.displayedSearchColumns.unshift('empty-column-search');
    }
  }

  initDataSource() {
    this.changeParamsObservable = merge(this.sort.sortChange, this.paginator.page, this.searchEvent).pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        const searchData: any = this.getSearchData();
        return this.getData(this.sort, this.paginator, searchData);
      }),
      map((data:TableContent) => {
        this.isLoadingResults = false;
        this.isError = false;
        this.resultsLength = data.total_count;
        this.rowsId = data.items.map((i: TableItem) => i.id);
        this.displayMessageColumn = this.rowsId.length > 0 ? [] : ['no-data'];
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
    this.selection.clear();
    this.rowUnselect.emit(null);
    this.paginator.pageIndex = 0;
  }

  emitSearchEvent() {
    this.selection.clear();
    this.rowUnselect.emit(null);
    this.searchEvent.emit();
  }

  toggleSelection(row: any) {
    this.selection.toggle(row.id);
    if (this.selection.isSelected(row.id)) {
      this.rowSelect.emit(row);
    } else {
      this.rowUnselect.emit(row);
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
        this.rowsId.forEach((id:any) => this.selection.select(id));
  }

  private getSearchData(): any {
    let result: any = {};
    Object.keys(this.searchForm).forEach(key => {
      result[key] = this.searchForm[key].value;
    })
    return result;
  }
}
