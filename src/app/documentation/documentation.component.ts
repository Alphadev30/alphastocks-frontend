import { Component, ViewChild , ElementRef} from '@angular/core';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss']
})
export class DocumentationComponent {
  @ViewChild('typingElement', { static: true }) typingElement!: ElementRef;

  constructor() { }

  ngOnInit(): void {
    const bannerHeading = this.typingElement.nativeElement;
    const text = ' Unlocking your Stock Trading Companion';
    let index = 0;

    function type() {
      if (index < text.length) {
        bannerHeading.textContent += text.charAt(index);
        index++;
        setTimeout(type, 70); // Adjust typing speed here (in milliseconds)
      }
    }

    type();
  }
}
