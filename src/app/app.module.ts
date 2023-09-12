import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { NewsPageComponent } from './news-page/news-page.component';
import { TechnicalAnalysisPageComponent } from './technical-analysis-page/technical-analysis-page.component';
import { NavigationComponent } from './shared/navigation/navigation.component';
import { HttpClientModule } from '@angular/common/http';
import {CompanyDataServices} from './services/CompanyData.services';
import { NewsPopupComponent } from './news-popup/news-popup.component';
import { TruncatePipe } from './truncate.pipe';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { NgChartsModule  } from 'ng2-charts';


import { FooterComponent } from './shared/footer/footer.component';
import { SentimentAnalysisComponent } from './sentiment-analysis/sentiment-analysis.component';
import { TechnicalDashboardComponent } from './technical-dashboard/technical-dashboard.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { DocumentationComponent } from './documentation/documentation.component'


@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    NewsPageComponent,
    TechnicalAnalysisPageComponent,
    NavigationComponent,
    NewsPopupComponent,
    TruncatePipe,
    FooterComponent,
    SentimentAnalysisComponent,
    TechnicalDashboardComponent,
    BarChartComponent,
    DocumentationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule ,
    FormsModule,
    NgChartsModule 
  ],
  providers: [CompanyDataServices],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor() {
    // Add icons to the library
    library.add(fas);
  }
}
