import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit {


  @Input() pageName: string = ""; // Define pageName as an input property
  @Output() tabDataChanged = new EventEmitter<any>(); // Define an Output property
  @Output() currentTab = new EventEmitter<any>(); // Define an Output property


  // Tabs
  tabData: any[] = [];
  selectedTab: number = 0;
  totalTabs = 3;

  displayedData: any[] = []; // Make sure displayedData is an array
  searchedData : any[] = [];

  searchTerm : string = "";

  // Create a FormControl for the search input
  searchInput = new FormControl();

  ngOnInit(): void {
    this.selectTab(this.selectedTab);
    this.loadAllTabsIfOpen();
  }

  // Load tabs from local storage when the component initializes
  loadAllTabsIfOpen(): void {
    for (let i = 0; i < this.totalTabs-1; i++) {
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
      localStorage.removeItem(this.pageName + tabIndex); // Remove the corresponding tab data from local storage
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
    console.log("tab:", this.pageName+index);
    this.tabDataChanged.emit(this.tabData[this.selectedTab]);
    this.currentTab.emit(index);
  }

  // Add a new tab
  addTab(): void {
    this.tabData.push([]);
    //this.totalTabs++;
    this.selectedTab = this.tabData.length - 1;
    // Initialize data for the new tab
    // this.displayedStockData = this.tabData[this.selectedTab]; // Set displayed data to the new tab's data
    // this.saveTabData(this.selectedTab);
  }


  // Load tab data from local storage
  loadTabData(tabIndex: number): void {
    const savedData = localStorage.getItem(this.pageName + tabIndex);

    if (savedData) {
      this.tabData[tabIndex] = JSON.parse(savedData);
      this.displayedData = this.tabData[tabIndex]; // Assign the variable displayedData with savedData
    } else {
      this.tabData[tabIndex] = []; // Initialize with an empty array if no data is found
    }
  }


   // Add a function to search data based on the input
   searchData(): void {

    const searchTerm = this.searchTerm.toLowerCase();

    if (searchTerm) {
      // Filter displayedData based on the search term and store it in searchedData
      this.searchedData = this.tabData[this.selectedTab].filter((item: { symbol: string; }) =>

        item.symbol.toLowerCase().includes(searchTerm)
      );
    } else {
      // If the search input is empty, reset searchedData to an empty array
      this.searchedData = [];
    }

    this.tabDataChanged.emit(this.searchedData);
  }


  clearSearch(): void {
    this.searchInput.setValue("");
    this.searchedData = []; // Reset the searchedData to an empty array
  }
}
