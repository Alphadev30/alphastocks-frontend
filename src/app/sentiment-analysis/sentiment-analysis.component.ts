import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../enironments/environment';



@Component({
  selector: 'app-sentiment-analysis',
  templateUrl: './sentiment-analysis.component.html',
  styleUrls: ['./sentiment-analysis.component.scss']
})
export class SentimentAnalysisComponent {
  userMessage = '';
  chatMessages: { text: string; type: 'user' | 'bot' }[] = [];

  constructor(private http: HttpClient) { }

  ngOnIt(): void {

  }

  sendMessage() {
    // Add the user's message to the chat
    this.chatMessages.push({ text: this.userMessage, type: 'user' });

    // Define the API URL
    const apiUrl = environment.getNewsSentiment; // Replace with your actual API URL

    // Create an instance of HttpParams and append the JSON object
    const params = new HttpParams().set('req', this.userMessage);

    // Make the GET request with the parameters
    this.http.get(apiUrl, { params }).subscribe(
      (response: any) => {
        // Handle the API response here and add it to the chat
        const botResponse: { text: string; type: 'bot' } = {
          text: response.analysis,
          type: 'bot'
        };
        this.chatMessages.push(botResponse);
      },
      (error) => {
        // Handle errors here
        console.error('Error:', error);
      }
    );

    // Clear the input field
    this.userMessage = '';
  }

}
