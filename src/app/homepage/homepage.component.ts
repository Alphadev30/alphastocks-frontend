import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  @ViewChild('typingElement', { static: true }) typingElement!: ElementRef;

  constructor() { }

  ngOnInit(): void {
    const bannerHeading = this.typingElement.nativeElement;
    const text = ' Invest with Confidence';
    let index = 0;

    function type() {
      if (index < text.length) {
        bannerHeading.textContent += text.charAt(index);
        index++;
        setTimeout(type, 75); // Adjust typing speed here (in milliseconds)
      }
    }

    type();
  }

}