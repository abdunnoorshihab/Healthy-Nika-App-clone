import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss'],
})
export class BottomNavComponent  implements OnInit {
  @Output() homeButtonClicked = new EventEmitter<void>();
  constructor() { }

  ngOnInit() {}


  // Emit event when home button is clicked
  onHomeButtonClick() {
    this.homeButtonClicked.emit();
  }
}
