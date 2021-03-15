import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { TableContent } from '../default-table/default-table.component';
import { MatPaginator } from '@angular/material/paginator';
import { map } from 'rxjs/operators';

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

  getHomeData = (sort: MatSort, paginator: MatPaginator): Observable<TableContent> => {
    const href = 'https://api.github.com/search/issues';
    const requestUrl = `${href}?q=repo:angular/components&sort=${'created'}&order=${sort.direction}&page=${paginator.pageIndex + 1}&per_page=${paginator.pageSize}`;

    return this.httpClient.get<TableContent>(requestUrl);
  }

  homeTableRowChanged = (row: any[]): void => {
    this.gitIssueSelected = row[0];
  }

  getCommitData = (sort: MatSort, paginator: MatPaginator): Observable<TableContent> => {
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

