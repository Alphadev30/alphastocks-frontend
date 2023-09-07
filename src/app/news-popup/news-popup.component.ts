import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-news-popup',
  templateUrl: './news-popup.component.html',
  styleUrls: ['./news-popup.component.scss']
})
export class NewsPopupComponent {

  newsItem: any;
  showFullNews: boolean = false; // Track whether to show full news content


  constructor(private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    // Access the route parameter to retrieve the news item data
    this.route.paramMap.subscribe((params) => {
      const state = window.history.state;
      if (state && state.newsItem) {
        this.newsItem = state.newsItem;
      }
    });
  }

  closePopup(): void {
    // Use the Router service to navigate back to the previous page (NewsPageComponent)
    this.router.navigate(['/news']);
  }

  toggleFullNews(): void {
    // Toggle the showFullNews flag to switch between full and truncated content
    this.showFullNews = !this.showFullNews;
  }
}
