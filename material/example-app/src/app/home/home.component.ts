import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { TableColumn, TableContent, TableConfig } from '../default-table/default-table.component';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  homeTableConfig: HomeTableConfig;
  commitsTableConfig: CommitsTableConfig;

  gitIssueSelected: any;

  constructor(
    httpClient: HttpClient,
    datePipe: DatePipe
  ) {
    this.homeTableConfig = new HomeTableConfig(httpClient, datePipe, this.homeTableRowChanged);
    this.commitsTableConfig = new CommitsTableConfig(httpClient, datePipe);
  }

  homeTableRowChanged = (row: any[]): void => {
    this.gitIssueSelected = row[0];
  }
}

class HomeTableConfig implements TableConfig {
  defaultSort = 'created';

  columns:TableColumn[] = [
    {key: 'created_at', label: 'Created', sort: true, getFormatted: (data:any) => {return this.datePipe.transform(data)}},
    {key: 'title', label: 'Title'},
    {key: 'number', label: '#'}
  ];

  constructor(
    private httpClient: HttpClient,
    private datePipe: DatePipe,
    private selectedRowChangedCallback: (row: any[]) => void,
  ) {}

  selectedRowChanged(row: any[]): void {
    this.selectedRowChangedCallback(row);
  }

  getData = (sort: MatSort, paginator: MatPaginator): Observable<TableContent> => {
    const href = 'https://api.github.com/search/issues';
    const requestUrl = `${href}?q=repo:angular/components&sort=${'created'}&order=${sort.direction}&page=${paginator.pageIndex + 1}&per_page=${paginator.pageSize}`;

    return this.httpClient.get<TableContent>(requestUrl);
  }
}

class CommitsTableConfig implements TableConfig {
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

  selectedRowChanged(row: any[]): void {
    // not implemented yet
  }

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

