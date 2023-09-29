import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../services/localStorage/local-storage.service';
import { environment } from 'src/enironments/environment';
import { keypair } from 'src/enironments/keypairs';

@Component({
  selector: 'app-tech-bollinger-bands',
  templateUrl: './tech-bollinger-bands.component.html',
  styleUrls: ['./tech-bollinger-bands.component.scss']
})
export class TechBollingerBandsComponent implements OnInit {

  bollingerFilteredStocks: any[] = [];
  filteredStock: any[] = [];

  length = 20;
  mult = 2 ;

  // Candlestick Timeframe
  selectedTimeframe: string = '1wk';

  resultMessage: string = "Discover NSE stocks exceeding resistance among 300+ companies analyzed by our bot, adjusted to your time interval.";

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

   // Tabs
   tabData: any[] = [];
   selectedTab: number = 0;
 
   localStorageKey : string = "tabDataBollinger_";

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    //localStorage.clear();

    this.setDefaultValues();

  }

  onTabChanged(tab : any) : void {
    this.selectedTab = tab;
  }

  onTabDataChanged(newData: any): void {
    // Handle the updated tabData received from the TabComponent
    this.displayedStockData = newData;
    this.filteredStock = newData;

  }


  // Save tab data to local storage
  saveTabData(tabIndex: number): void {
    //this.tabData[tabIndex] = this.displayedStockData;
    const dataToSave = this.displayedStockData;
    localStorage.setItem(this.localStorageKey + tabIndex, JSON.stringify(dataToSave));
  }

  


  runBot(): void {
    this.findBollingerCross();
  }

  findBollingerCross() {


    const getBollingerAPI = environment.getBollingerBands;
    console.log(this.selectedTimeframe)
    const params = new HttpParams().set('signalLength', this.length).set('mult', this.mult).set('TimeFrame', '' + this.selectedTimeframe.toLowerCase());
    this.isLoading = true;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: keypair.technicalKey,
    });

    this.http.get(getBollingerAPI, { headers, params }).subscribe(
      (response: any) => {
        this.bollingerFilteredStocks = response;
        this.showResTab();
        this.updateDisplayedContent();
        //this.addTab();
        this.isLoading = false;
        this.saveTabData(this.selectedTab);
      },
      (error) => {
        console.error('Error fetching macd data:', error);
        this.isLoading = false;
      }
    );
    this.updateDisplayedContent();
  }


  showResTab() {
    this.totalPages = Math.ceil(this.bollingerFilteredStocks.length / this.itemsPerPage);
    this.filteredStock = this.bollingerFilteredStocks;
    this.setResultMessage();
    this.currentPage = 1;
    this.updateDisplayedContent();
    
  }



  setDefaultValues() {

    this.selectedTimeframe = '1wk'

    this.resultMessage = ""
  }


  setResultMessage() {

    let interval = "weeks";

    if (this.selectedTimeframe == '1d') {
      interval = "days"
    }

    this.resultMessage = "The current price is near the lower band level for these stocks";

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
    //this.loadTabData()
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
}
