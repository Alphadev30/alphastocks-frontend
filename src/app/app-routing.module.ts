import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsPageComponent } from './news-page/news-page.component';
import { HomepageComponent } from './homepage/homepage.component'; // Import the HomePageComponent
import { NewsPopupComponent } from './news-popup/news-popup.component'; // Import the Popup Component
import { SentimentAnalysisComponent } from './sentiment-analysis/sentiment-analysis.component';
import { TechnicalDashboardComponent } from './technical-dashboard/technical-dashboard.component';
import { DocumentationComponent } from './documentation/documentation.component';
import { TechResistanceCrossComponent } from './tech-resistance-cross/tech-resistance-cross.component';
import { TechMaMacdCrossComponent } from './tech-ma-macd-cross/tech-ma-macd-cross.component';
import { TechBollingerBandsComponent } from './tech-bollinger-bands/tech-bollinger-bands.component';
import { TechVolatileBotComponent } from './tech-volatile-bot/tech-volatile-bot.component';



const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect to news page
  { path: 'news', component: NewsPageComponent },
  { path: 'home', component: HomepageComponent },
  { path: 'popup', component: NewsPopupComponent }, // Add a route for the Popup Component
  { path: 'chat', component : SentimentAnalysisComponent },
  { path: 'dashboard', component : TechnicalDashboardComponent}, 
  { path: 'documentation', component: DocumentationComponent },
  { path: 'dashboard/resistance', component: TechResistanceCrossComponent },
  { path: 'dashboard/momentum/:id', component: TechMaMacdCrossComponent },
  { path: 'dashboard/bollinger', component: TechBollingerBandsComponent },
  { path: 'dashboard/volatile', component: TechVolatileBotComponent }



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
