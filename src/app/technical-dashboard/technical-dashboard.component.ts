import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/enironments/environment';
import { keypair } from 'src/enironments/keypairs';

@Component({
  selector: 'app-technical-dashboard',
  templateUrl: './technical-dashboard.component.html',
  styleUrls: ['./technical-dashboard.component.scss']
})
export class TechnicalDashboardComponent implements OnInit, AfterViewInit {

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
  originalStockData: any[] = []; // Initialize this with your original data
  filteredStockData: any[] = []; // Initialize this as an empty array

  // Bar Charts

  public resultData = [
    { name: 'Company A', value1: 65, value2: 80, value3: 45 },
    { name: 'Company B', value1: 75, value2: 70, value3: 60 },
    // Add more data objects as needed
  ];

  constructor(private http: HttpClient, private router: Router) { }

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

  ngAfterViewInit(): void {
  }






  runBot(): void {
    if (this.showingMaData) {
      this.findMaCrossovers();
    }
    else {
      this.findMacdCrossovers();
    }
  }

  findMacdCrossovers() {

    console.log("running macd : ")
    const getMaCrossoverAPI = environment.getMacdCross;
    const params = new HttpParams().set('fastlength', this.macdFastLength).set('slowlength', this.macdSlowLength).set('signallength', this.macdSignalLength).set('TimeFrame', '' + this.selectedTimeframe.toLowerCase());
    this.isLoading = true;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: keypair.technicalKey,
    });

    this.http.get(getMaCrossoverAPI, { headers, params }).subscribe(
      (response: any) => {
        this.macdFilteredStocks = response;
        this.showMacdTab();
        this.updateDisplayedContent();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching macd data:', error);
        this.isLoading = false;
      }
    );
    this.updateDisplayedContent();
  }

  findMaCrossovers() {
    console.log("running ma : ")
    const getMaCrossoverAPI = environment.getMaCross;
    const params = new HttpParams().set('shortma', this.shortMa).set('longma', this.longMa).set('TimeFrame', '' + this.selectedTimeframe.toLowerCase());
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: keypair.technicalKey,
    });
    this.isLoading = true;

    this.http.get(getMaCrossoverAPI, { headers, params }).subscribe(
      (response: any) => {
        this.maFilteredStocks = response;
        this.showMaTab();
        this.updateDisplayedContent();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching ma data:', error);
        this.isLoading = false;
      }
    );

    this.updateDisplayedContent();
    //this.findMacdCrossovers();
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

    let interval = "weeks";

    if (this.selectedTimeframe == '1d') {
      interval = "days"
    }
    if (this.showingMaData) {
      this.resultMessage = "These stocks were selected based on a " + this.shortMa + "-day short-term and " + this.longMa + "-day long-term Moving Average (MA), detecting crossovers that occurred in the past 8 " + interval;
    } else {
      this.resultMessage = "These are your custom MACD-filtered stocks, detecting crossovers that occurred in the past 6 " + interval;
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
    this.originalStockData = this.filteredStock.slice(startIndex, startIndex + this.itemsPerPage);

    this.displayedStockData = this.originalStockData
  }

  showFilterPopup() {
    this.showFilter = true;
  }

  closeFilterPopup() {
    this.showFilter = false;
  }

  calculatePercentageChange(recentPrice: number, priorPrice: number): string {
    const percentageChange = ((recentPrice - priorPrice) / priorPrice) * 100;

    if (percentageChange >= 0) {
      return `+${percentageChange.toFixed(2)}%`;
    } else {
      return `${percentageChange.toFixed(2)}%`;
    }
  }

  getPercentageChangeColor(recentPrice: number, priorPrice: number): string {
    const percentageChange = this.calculatePercentageChange(recentPrice, priorPrice);
    if (percentageChange.startsWith('+')) {
      return 'green'; // Positive change, use green color
    } else if (percentageChange.startsWith('-')) {
      return 'red'; // Negative change, use red color
    } else {
      return 'black'; // No change, use black color
    }
  }

  applyFilters() {


    if (!this.filterOptions.volumeIncreasing && !this.filterOptions.todayVolumeGreaterThanAvg && !this.filterOptions.priceIncreasing) {
      this.clearFilters();
    } else {

      // Clear the filtered data array to start with a clean slate
      this.filteredStockData = [];

      // Apply filters based on selected options to the original data
      this.filteredStock.forEach((stock) => {
        if (
          (this.filterOptions.volumeIncreasing &&
            stock.volume.today > stock.volume.oneDayPrior &&
            stock.volume.oneDayPrior > stock.volume.twoDayPrior) ||
          (this.filterOptions.todayVolumeGreaterThanAvg &&
            stock.volume.today > stock.volume.weekAverage) ||
          (this.filterOptions.priceIncreasing &&
            stock.price.today > stock.price.oneDayPrior &&
            stock.price.oneDayPrior > stock.price.twoDayPrior)
        ) {
          // If any filter condition matches, add the stock to the filtered array
          this.filteredStockData.push(stock);
        }
      });
      // Update the displayed data to show filtered data
      this.displayedStockData = this.filteredStockData;

    }

    // Close the filter popup
    this.closeFilterPopup();


  }

  clearFilters() {
    // Clear the filter options and show all original data
    this.filterOptions = {
      volumeIncreasing: false,
      todayVolumeGreaterThanAvg: false,
      priceIncreasing: false
    };

    // Reset displayed data to show the original data
    this.displayedStockData = this.originalStockData;

    this.updateDisplayedContent();

    // Close the filter popup
    this.closeFilterPopup();
  }

  navigateToResistance() {
    this.router.navigate(['/dashboard/resistance']);
  }

  navigateToMovingAverage(id: any) {
    console.log(id)
    //this.router.navigate(['/dashboard/momentum']);

    // Define the route and parameters
    const route = ['/dashboard/momentum', id];

    // Create the URL tree with the route and parameters
    const urlTree = this.router.createUrlTree(route);

    // Serialize the URL tree to a string
    const url = this.router.serializeUrl(urlTree);

    // Navigate to the generated URL
    this.router.navigateByUrl(url);
  }

  navigateToBollinger() {
    this.router.navigate(['/dashboard/bollinger']);
  }

  navigateToVolatility() {
    this.router.navigate(['/dashboard/volatile']);
  }

}

