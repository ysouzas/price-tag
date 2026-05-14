import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/barcode-home/barcode-home.component').then(
        (m) => m.BarcodeHomeComponent,
      ),
    pathMatch: 'full',
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./pages/front-page/front-page.component').then(
        (m) => m.FrontPageComponent,
      ),
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
