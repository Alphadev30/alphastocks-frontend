import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/enironments/environment';
import { keypair } from 'src/enironments/keypairs';
import { LocalStorageService } from '../services/localStorage/local-storage.service' // Adjust the path as needed


@Component({
  selector: 'app-tech-resistance-cross',
  templateUrl: './tech-resistance-cross.component.html',
  styleUrls: ['./tech-resistance-cross.component.scss']
})
export class TechResistanceCrossComponent implements OnInit {

  resFilteredStocks: any[] = [];
  filteredStock: any[] = [];

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


  // Tabs
  // Define a data structure
  tabData: any[] = [];
  selectedTab: number = 0;
  totalTabs = 0;

  // Bar Charts
  public resultData = [
    { name: 'Company A', value1: 65, value2: 80, value3: 45 },
    { name: 'Company B', value1: 75, value2: 70, value3: 60 },
    // Add more data objects as needed
  ];

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    //localStorage.clear();
    this.totalTabs = this.localStorageService.getTotalItemsWithPrefix('tabDataRes_');

    this.setDefaultValues();
    this.selectTab(this.selectedTab);
    this.loadAllTabsIfOpen();
  }

  loadAllTabsIfOpen(): void {
    for (let i = 0; i < this.totalTabs; i++) {
      const savedData = localStorage.getItem(`tabDataRes_${i}`);
      if (savedData) {
        this.tabData[i] = JSON.parse(savedData);
        this.addTab(); // Add a new tab for each open tab in local storage
      }
    }
    // Select the first tab (or any default tab you prefer)
    this.selectTab(0);
  }

  closeTabOnMiddleClick(tabIndex: number, event: MouseEvent): void {
    if (event.button === 1) {
      // Middle mouse button was clicked (event.button === 1)
      event.preventDefault(); // Prevent the default behavior (e.g., opening a new tab)
      this.closeTab(tabIndex);
    }
  }
  
  closeTab(tabIndex: number): void {
    if (this.tabData.length > 1) {
      this.tabData.splice(tabIndex, 1); // Remove the tab at the specified index
      localStorage.removeItem(`tabDataRes_${tabIndex}`); // Remove the corresponding tab data from local storage
      if (this.selectedTab >= this.tabData.length) {
        this.selectTab(this.tabData.length - 1); // Select the last tab if the currently selected tab was closed
      }
    }
  }
  


  selectTab(index: number): void {
    console.log("1) selected Tab : ", index);
    this.selectedTab = index;
    // Load data for the selected tab
    this.loadTabData(this.selectedTab);
    // Update displayed data to match the selected tab's data
    this.displayedStockData = this.tabData[this.selectedTab];

    console.log("3) displayedStockData : ", this.displayedStockData);
  }

  addTab(): void {
    this.tabData.push([]);
    console.log("---> new tab added : ", this.tabData);

    this.selectedTab = this.tabData.length - 1;
    // Initialize data for the new tab
    this.displayedStockData = this.tabData[this.selectedTab]; // Set displayed data to the new tab's data
    console.log("----> displayedStockData in new tab : ", this.displayedStockData);
    this.loadTabData(this.selectedTab);
    this.saveTabData(this.selectedTab);
  }

  saveTabData(tabIndex: number): void {
    this.tabData[tabIndex] = this.displayedStockData;
    const dataToSave = this.tabData[tabIndex];
  
    localStorage.setItem(`tabDataRes_${tabIndex}`, JSON.stringify(dataToSave));
    console.log("data saved : ", localStorage.getItem(`tabDataRes_${tabIndex}`));
  }

  loadTabData(tabIndex: number): void {
    
    const savedData = localStorage.getItem(`tabDataRes_${tabIndex}`);
    console.log("2) loadTabData : ", savedData);

    if (savedData) {
      this.tabData[tabIndex] = JSON.parse(savedData);
    } else {
      this.tabData[tabIndex] = []; // Initialize with an empty array if no data is found
    }
  }


  runBot(): void {
    this.findResistanceCross();
  }

  findResistanceCross() {

    console.log("running resistance : ")
    const getResCrossoverAPI = environment.getResCross;
    const params = new HttpParams().set('TimeFrame', '' + this.selectedTimeframe);
    this.isLoading = true;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: keypair.technicalKey,
    });

    this.http.get(getResCrossoverAPI, { headers, params }).subscribe(
      (response: any) => {
        this.resFilteredStocks = response;
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
    this.totalPages = Math.ceil(this.resFilteredStocks.length / this.itemsPerPage);
    this.filteredStock = this.resFilteredStocks;
    this.showingMaData = false;
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

    if (this.selectedTimeframe == '1D' || this.selectedTimeframe == '1d') {
      interval = "days"
    }

    this.resultMessage = "The current price exceeds the resistance level and is just 2% higher than the resistance for these stocks | Fibonacci retracement | Timeframe: " + interval;

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
