import { Routes } from '@angular/router';
import { FrontPageComponent } from './pages/front-page/front-page.component';

export const routes: Routes = [
  {
    path: '',
    component: FrontPageComponent,
    pathMatch: 'full',
  },
  {
    path: 'supermarkets',
    loadComponent: () =>
      import('./pages/supermarkets/supermarkets.component').then(
        (m) => m.SupermarketsComponent,
      ),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/products/products.component').then(
        (m) => m.ProductsComponent,
      ),
  },
  {
    path: 'product/:barcode',
    loadComponent: () =>
      import('./pages/product-details/product-details.component').then(
        (m) => m.ProductDetailsComponent,
      ),
  },
];
