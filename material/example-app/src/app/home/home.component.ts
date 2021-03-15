import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { map } from 'rxjs/operators';
import { TableContent } from '../app-table/types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  gitIssueSelected: any;

  constructor(
    private httpClient: HttpClient
  ) {}

  getHomeData = (sort: MatSort, paginator: MatPaginator, searchData: any): Observable<TableContent> => {
    const href = 'https://api.github.com/search/issues';
    const requestUrl = `${href}?q=repo:angular/components+${searchData.title}+in:title&sort=${'created'}&order=${sort.direction}&page=${paginator.pageIndex + 1}&per_page=${paginator.pageSize}`;

    return this.httpClient.get<TableContent>(requestUrl);
  }

  homeTableOnRowSelect = (row: any): void => {
    this.gitIssueSelected = row;
  }

  homeTableOnRowUnselect = (): void => {
    this.gitIssueSelected = undefined;
  }

  getCommitData = (sort: MatSort, paginator: MatPaginator, searchData: any): Observable<TableContent> => {
    const href = 'https://api.github.com/search/commits';
    const requestUrl = `${href}?q=repo:angular/components+css&sort=${'committer-date'}&order=${sort.direction}&page=${paginator.pageIndex + 1}&per_page=${paginator.pageSize}`;

    const httpOptions = {
      headers: new HttpHeaders({ 'Accept': 'application/vnd.github.cloak-preview+json' })
    };

    return this.httpClient.get<TableContent>(requestUrl, httpOptions).pipe(
      map(result => {
        result.items = result.items.map(item => ({
          id: item.sha,
          author: item.commit.author.name,
          date: item.commit.committer.date,
          message: (item.commit.message && item.commit.message.length > 80) ? item.commit.message.substring(0, 80) : item.commit.message,
        }))
        return result;
      })
    );
  }
}

