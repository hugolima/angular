import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { TableColumn, TableContent, TableDataSource } from '../default-table/default-table.component';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  homeTableDataSource: HomeTableDataSource;
  commitsTableDataSource: CommitsTableDataSource;

  constructor(
    httpClient: HttpClient,
    datePipe: DatePipe
  ) {
    this.homeTableDataSource = new HomeTableDataSource(httpClient, datePipe);
    this.commitsTableDataSource = new CommitsTableDataSource(httpClient, datePipe);
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

class CommitsTableDataSource implements TableDataSource {
  defaultSort = 'committer-date';

  columns:TableColumn[] = [
    {key: 'date', label: 'Date', sort: true, getFormatted: (data:any) => {return this.datePipe.transform(data)}},
    {key: 'author', label: 'Author'},
    {key: 'message', label: 'Message'}
  ];

  constructor(
    private httpClient: HttpClient,
    private datePipe: DatePipe
  ) {}

  getData = (sort: MatSort, paginator: MatPaginator): Observable<TableContent> => {
    const href = 'https://api.github.com/search/commits';
    const requestUrl = `${href}?q=repo:angular/components+css&sort=${'committer-date'}&order=${sort.direction}&page=${paginator.pageIndex + 1}&per_page=${paginator.pageSize}`;

    const httpOptions = {
      headers: new HttpHeaders({ 'Accept': 'application/vnd.github.cloak-preview+json' })
    };

    return this.httpClient.get<TableContent>(requestUrl, httpOptions).pipe(
      map(result => {
        result.items = result.items.map(item => ({
          author: item.commit.author.name,
          date: item.commit.committer.date,
          message: item.commit.message,
        }))
        return result;
      })
    );
  }
}

