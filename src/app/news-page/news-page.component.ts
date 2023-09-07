import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { environment } from '../../enironments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyDataServices } from '../services/CompanyData.services'
import { PopupService } from '../services/PopupService.services';




@Component({
  selector: 'app-news-page',
  templateUrl: './news-page.component.html',
  styleUrls: ['./news-page.component.scss'],
  providers: [DatePipe]
})
export class NewsPageComponent implements OnInit {

  // Storing
  newsData: any[] = [];
  companyData: any[] = [];
  companyPlusNews: any[] = [];


  // For Pagination
  displayedNewsData: any[] = [];
  itemsPerPage = 5;
  currentPage = 1;
  totalPages = 0;

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router,
    private companyDataService: CompanyDataServices,
    private popupService: PopupService) {
  }

  ngOnInit(): void {
    this.companyData = [];
    this.newsData = [];

    this.fetchNewsData();
  }


  fetchNewsData(): void {
    const apiUrl = environment.getSentiments;

    this.http.get(apiUrl).subscribe(
      (response: any) => {
        this.newsData = response;
        let reversedNewsData = this.newsData.slice().reverse();
        this.totalPages = Math.ceil(reversedNewsData.length / this.itemsPerPage);
        this.getCompanyWithNews();
      },
      (error) => {
        console.error('Error fetching news data:', error);
      }
    );
  }

  openNewsPopup(newsItem: any) {
    console.log(newsItem);
    this.popupService.openPopup(newsItem);
  }



  updateDisplayedNews(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    let reversedNewsData = this.companyPlusNews.slice().reverse();
    this.displayedNewsData = reversedNewsData.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedNews();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedNews();
    }
  }


  getCompanyWithNews(): void {

    const getCompanyByNewsIdApiUrl = environment.getCompanyByNewsId;

    this.newsData.forEach(item => {

      if (item.sentiment != "null") {
        console.log(item.sentiment);
        const combinedData = {
          ...item,
          companyName: null // Initialize the companyName with null
        };

        const newsId = item.news.id;
        const params = new HttpParams().set('id', newsId);

        this.http.get(getCompanyByNewsIdApiUrl, { params }).subscribe(
          (response: any) => {
            combinedData.companyName = response.companyName; // Update the companyName once the response is received
          },
          (error) => {
            console.error('Error fetching news data:', error);
          }
        );

        this.companyPlusNews.push(combinedData);
      }


    })
    this.updateDisplayedNews();
  }

  openPopup(newsItem: any) {
    // Pass the selected news item as a route parameter
    this.router.navigate(['/popup'], { state: { newsItem } });
  }
}


