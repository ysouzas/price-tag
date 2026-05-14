import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [MatIconButton, MatIconModule],
  templateUrl: './back-button.component.html',
  styleUrl: './back-button.component.scss'
})
export class BackButtonComponent {
  @Input() label = '';

  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
