import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../enironments/environment';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class CompanyDataServices {
    constructor(private http: HttpClient) {}
  
    getCompanyPlusNews(newsData: any[]): Observable<any[]> {
        const getCompanyByNewsIdApiUrl = environment.getCompanyByNewsId;
      
        const combinedDataObservable: Observable<any>[] = newsData.map(newsItem => {
          const newsId = newsItem.news.id;
          const params = new HttpParams().set('id', newsId);
      
          return this.http.get(getCompanyByNewsIdApiUrl, { params }).pipe(
            map((companyData: any) => ({
              sentiment: newsItem.sentiment,
              analysis: newsItem.analysis,
              news: newsItem.news,
              companyName: companyData[0].companyName // Access companyName from the response
            }))
          );
        });
      
        return forkJoin(combinedDataObservable);
      }
  }