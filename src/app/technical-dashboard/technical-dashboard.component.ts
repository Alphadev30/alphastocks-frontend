import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { environment } from 'src/enironments/environment';

@Component({
  selector: 'app-technical-dashboard',
  templateUrl: './technical-dashboard.component.html',
  styleUrls: ['./technical-dashboard.component.scss']
})
export class TechnicalDashboardComponent {

  @ViewChild('typingElement', { static: true }) typingElement!: ElementRef;

  maFilteredStocks: any[] = [];
  macdFilteredStocks: any[] = [];
  filteredStock: any[] = [];

  // MA Fields variables
  shortMa: number = 0;
  longMa: number = 0;

  // MACD Variables
  macdFastLength: number = 0;
  macdSlowLength: number = 0;
  macdSignalLength: number = 0;

  // Candlestick Timeframe
  selectedTimeframe: string = '1wk';

  resultMessage: string = "Fine-tune settings and discover NSE stocks showing recent MA and MACD crossovers among 300+ companies analyzed by our bot.";

  isLoading = false;
  showingMaData = true;

  // For Pagination
  displayedStockData: any[] = [];
  itemsPerPage = 7;
  currentPage = 1;
  totalPages = 0;

  // Filter popup 
  showFilter = false;
  filterOptions = {
    volumeIncreasing: false,
    todayVolumeGreaterThanAvg: false,
    priceIncreasing: false
  };

  // Bar Charts

  public resultData = [
    { name: 'Company A', value1: 65, value2: 80, value3: 45 },
    { name: 'Company B', value1: 75, value2: 70, value3: 60 },
    // Add more data objects as needed
  ];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {

    this.setDefaultValues();

    const bannerHeading = this.typingElement.nativeElement;
    const text = "Where Data Drives Your Investment Strategy";
    let index = 0;

    function type() {
      if (index < text.length) {
        bannerHeading.textContent += text.charAt(index);
        index++;
        setTimeout(type, 55); // Adjust typing speed here (in milliseconds)
      }
    }

    type();
  }




  findMacdCrossovers() {

    console.log("running macd : ")
    const getMaCrossoverAPI = environment.getMacdCross;
    const params = new HttpParams().set('fastlength', this.macdFastLength).set('slowlength', this.macdSlowLength).set('signallength', this.macdSignalLength);
    this.isLoading = true;

    this.http.get(getMaCrossoverAPI, { params }).subscribe(
      (response: any) => {
        this.macdFilteredStocks = response;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching news data:', error);
        this.isLoading = false;
      }
    );
  }

  findMaCrossovers() {
    console.log("running ma : ")
    const getMaCrossoverAPI = environment.getMaCross;
    const params = new HttpParams().set('shortma', this.shortMa).set('longma', this.longMa).set('TimeFrame', "1wk");
    this.isLoading = true;

    this.http.get(getMaCrossoverAPI, { params }).subscribe(
      (response: any) => {
        this.maFilteredStocks = response;

        this.showMaTab();
        this.updateDisplayedContent();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching news data:', error);
        this.isLoading = false;
      }
    );

    this.updateDisplayedContent();
    this.findMacdCrossovers();
  }



  setDefaultValues() {
    this.shortMa = 35;
    this.longMa = 140;
    this.macdFastLength = 15;
    this.macdSlowLength = 30;
    this.macdSignalLength = 8;
    this.selectedTimeframe = '1wk'

    this.resultMessage = "Fine-tune settings and discover NSE stocks showing recent MA and MACD crossovers among 300+ companies analyzed by our bot."
  }

  showMacdTab() {
    this.totalPages = Math.ceil(this.macdFilteredStocks.length / this.itemsPerPage);
    this.filteredStock = this.macdFilteredStocks;
    this.showingMaData = false;
    this.setResultMessage();
    this.currentPage = 1;
    this.updateDisplayedContent();
  }

  showMaTab() {
    this.totalPages = Math.ceil(this.maFilteredStocks.length / this.itemsPerPage);
    this.filteredStock = this.maFilteredStocks;
    this.showingMaData = true;
    this.setResultMessage();
    this.currentPage = 1;

    this.updateDisplayedContent();
  }

  setResultMessage() {
    if (this.showingMaData) {
      this.resultMessage = "These are the stocks filtered by a " + this.shortMa + "-short and " + this.longMa + "-long MA crossover strategy."
    } else {
      this.resultMessage = "These are your custom MACD-filtered stocks";
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedContent();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedContent();
    }
  }

  updateDisplayedContent(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    //let stockData = this.filteredStock.slice();
    this.displayedStockData = this.filteredStock.slice(startIndex, startIndex + this.itemsPerPage);
  }

  showFilterPopup() {
    this.showFilter = true;
  }

  closeFilterPopup() {
    this.showFilter = false;
  }

  applyFilters() {
    // Implement your logic to apply the selected filters and update the displayedStockData accordingly.
    // You can access the selected filter options in this.filterOptions.
    // Once the filters are applied, you can close the popup by calling this.closeFilterPopup().
  }

}
