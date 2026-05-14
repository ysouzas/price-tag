import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ProductSearchComponent } from '../../components/product-search/product-search.component';
import { SupermarketSearchComponent } from '../../components/supermarket-search/supermarket-search.component';

@Component({
  selector: 'app-front-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    TranslateModule,
    ProductSearchComponent,
    SupermarketSearchComponent,
  ],
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.scss'],
})
export class FrontPageComponent {}
