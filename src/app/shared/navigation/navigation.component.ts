import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  constructor(private router: Router) {}

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  navigateToNews(): void {
    this.router.navigate(['/news']);
  }

  navigateToChat() : void {
    this.router.navigate(['/chat']);
  }

  navigateToTechnical() : void {
    this.router.navigate(['/dashboard']);
  }
}
