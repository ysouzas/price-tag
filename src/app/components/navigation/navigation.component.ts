
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

interface NavItem {
  label: string;
  icon: string;
  section: 'scanner' | 'search' | 'supermarkets' | 'products';
  route?: string;
}

@Component({
    selector: 'app-navigation',
    imports: [
    RouterModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatBottomSheetModule,
    TranslateModule
],
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  @Input() activeSection: 'scanner' | 'search' | 'supermarkets' | 'products' =
    'scanner';
  @Output() navigationChange = new EventEmitter<
    'scanner' | 'search' | 'supermarkets' | 'products'
  >();

  navItems: NavItem[] = [
    {
      label: 'NAVIGATION.SCANNER',
      icon: 'camera_alt',
      section: 'scanner',
    },
    {
      label: 'NAVIGATION.SEARCH',
      icon: 'search',
      section: 'search',
    },
    {
      label: 'NAVIGATION.SUPERMARKETS',
      icon: 'store',
      section: 'supermarkets',
      route: '/supermarkets',
    },
    {
      label: 'NAVIGATION.PRODUCTS',
      icon: 'inventory',
      section: 'products',
      route: '/products',
    },
  ];

  onNavItemClick(item: NavItem): void {
    if (item.route) {
      // Router navigation will be handled by routerLink
      this.navigationChange.emit(item.section);
    } else {
      // Local section change
      this.navigationChange.emit(item.section);
    }
  }

  isActive(item: NavItem): boolean {
    return this.activeSection === item.section;
  }
}
