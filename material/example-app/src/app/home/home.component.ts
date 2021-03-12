import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { TableColumn, TableContent, TableDataSource } from '../default-table/default-table.component';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  homeTableDataSource: HomeTableDataSource;

  constructor(
    httpClient: HttpClient,
    datePipe: DatePipe
  ) {
    this.homeTableDataSource = new HomeTableDataSource(httpClient, datePipe);
  }

  ngOnInit(): void {
  }
}

class HomeTableDataSource implements TableDataSource {
  defaultSort = 'created';

  columns:TableColumn[] = [
    {key: 'created_at', label: 'Created', sort: true, getFormatted: (data:any) => {return this.datePipe.transform(data)}},
    {key: 'title', label: 'Title'},
    {key: 'number', label: '#'}
  ];

  constructor(
    private httpClient: HttpClient,
    private datePipe: DatePipe
  ) {}

  getData = (sort: MatSort, paginator: MatPaginator): Observable<TableContent> => {
    const href = 'https://api.github.com/search/issues';
    const requestUrl = `${href}?q=repo:angular/components&sort=${'created'}&order=${sort.direction}&page=${paginator.pageIndex + 1}&per_page=${paginator.pageSize}`;

    return this.httpClient.get<TableContent>(requestUrl);
  }
}

