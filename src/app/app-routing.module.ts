import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsPageComponent } from './news-page/news-page.component';
import { HomepageComponent } from './homepage/homepage.component'; // Import the HomePageComponent
import { NewsPopupComponent } from './news-popup/news-popup.component'; // Import the Popup Component
import { SentimentAnalysisComponent } from './sentiment-analysis/sentiment-analysis.component';
import { TechnicalDashboardComponent } from './technical-dashboard/technical-dashboard.component';



const routes: Routes = [
  { path: '', redirectTo: '/news', pathMatch: 'full' }, // Redirect to news page
  { path: 'news', component: NewsPageComponent },
  { path: 'home', component: HomepageComponent },
  { path: 'popup', component: NewsPopupComponent }, // Add a route for the Popup Component
  { path: 'chat', component : SentimentAnalysisComponent },
  { path: 'dashboard', component : TechnicalDashboardComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
