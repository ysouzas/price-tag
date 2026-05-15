import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ProductSearchComponent } from '@components/product-search/product-search.component';
import { SupermarketSearchComponent } from '@components/supermarket-search/supermarket-search.component';

@Component({
    selector: 'app-front-page',
    imports: [
        CommonModule,
        MatTabsModule,
        MatIconModule,
        TranslateModule,
        ProductSearchComponent,
        SupermarketSearchComponent,
    ],
    templateUrl: './front-page.component.html',
    styleUrls: ['./front-page.component.scss']
})
export class FrontPageComponent implements OnInit {
  selectedIndex = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const tab = params['tab'];
      if (tab !== undefined) {
        this.selectedIndex = +tab;
      }
    });
  }
}
