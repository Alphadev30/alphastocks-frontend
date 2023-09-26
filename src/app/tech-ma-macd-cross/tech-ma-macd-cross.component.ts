
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/enironments/environment';
import { keypair } from 'src/enironments/keypairs';
import { LocalStorageService } from '../services/localStorage/local-storage.service';

@Component({
  selector: 'app-tech-ma-macd-cross',
  templateUrl: './tech-ma-macd-cross.component.html',
  styleUrls: ['./tech-ma-macd-cross.component.scss']
})
export class TechMaMacdCrossComponent implements OnInit {
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

  resultMessage: string = "";

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
  // Define a data structure
  tabData: any[] = [];
  selectedTab: number = 0;
  totalTabs = 3;

  localStorageKey = 'tabDataMa';

  constructor(private http: HttpClient, private route: ActivatedRoute, private localStorageService: LocalStorageService) { }

  ngOnInit(): void {

    //localStorage.clear();

    let routeId;

    this.route.params.subscribe(params => {
      routeId = params['id'];
      this.localStorageKey = this.localStorageKey + routeId + '_';
      if (routeId == 0) {
        this.showingMaData = true;
      } else {
        this.showingMaData = false;

      }
      // Use 'id' and 'name' to fetch or display data
    });


    //this.totalTabs = this.localStorageService.getTotalItemsWithPrefix(this.localStorageKey) - 1;

    this.setDefaultValues();
    this.selectTab(this.selectedTab);
    this.loadAllTabsIfOpen();
  }

 // Load tabs from local storage when the component initializes
 loadAllTabsIfOpen(): void {
  for (let i = 1; i < this.totalTabs; i++) {
    this.addTab(); // Add a new tab for the first open tab in local storage
  }
  // Select the first tab (or any default tab you prefer)
  this.selectTab(0);
}

// Close a tab when the middle mouse button is clicked
closeTabOnMiddleClick(tabIndex: number, event: MouseEvent): void {
  if (event.button === 1) {
    // Middle mouse button was clicked (event.button === 1)
    event.preventDefault(); // Prevent the default behavior (e.g., opening a new tab)
  //  this.closeTab(tabIndex);
  }
}

// Close a tab
closeTab(tabIndex: number): void {
  if (this.tabData.length > 1) {
    localStorage.removeItem(this.localStorageKey + tabIndex); // Remove the corresponding tab data from local storage
    this.tabData.splice(tabIndex, 1); // Remove the tab at the specified index
    this.totalTabs--; // Decrease the totalTabs count
    if (this.selectedTab >= this.tabData.length) {
      this.selectTab(this.tabData.length - 1); // Select the last tab if the currently selected tab was closed
    }
  }
}

// Select a tab
selectTab(index: number): void {
  this.selectedTab = index;
  //this.saveTabData(this.selectedTab);
  // Load data for the selected tab
  this.loadTabData(this.selectedTab);
  // Update displayed data to match the selected tab's data
  this.displayedStockData = this.tabData[this.selectedTab];
}

// Add a new tab
addTab(): void {
  this.tabData.push([]);
  //this.totalTabs++;
  this.selectedTab = this.tabData.length - 1;
  // Initialize data for the new tab
  this.displayedStockData = this.tabData[this.selectedTab]; // Set displayed data to the new tab's data
  //this.saveTabData(this.selectedTab);
}

// Save tab data to local storage
saveTabData(tabIndex: number): void {
  this.tabData[tabIndex] = this.displayedStockData;
  const dataToSave = this.tabData[tabIndex];
  localStorage.setItem(this.localStorageKey + tabIndex, JSON.stringify(dataToSave));
}

// Load tab data from local storage
loadTabData(tabIndex: number): void {
  const savedData = localStorage.getItem(this.localStorageKey + tabIndex);
  if (savedData) {
    this.tabData[tabIndex] = JSON.parse(savedData);
  } else {
    this.tabData[tabIndex] = []; // Initialize with an empty array if no data is found
  }
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
    const params = new HttpParams().set('fastlength', this.macdFastLength).set('slowlength', this.macdSlowLength).set('signallength', this.macdSignalLength).set('TimeFrame', '' + this.selectedTimeframe);
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
        this.saveTabData(this.selectedTab);

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
    const params = new HttpParams().set('shortma', this.shortMa).set('longma', this.longMa).set('TimeFrame', '' + this.selectedTimeframe);
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
        this.saveTabData(this.selectedTab);

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

    if (this.selectedTimeframe == '1D' || this.selectedTimeframe == '1d') {
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
}
