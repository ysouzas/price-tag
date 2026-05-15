
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { SupermarketFormDialogComponent } from '../../components/dialogs/supermarket-form-dialog.component';
import { Supermarket, SupermarketService } from '@services/supermarket/supermarket.service';

@Component({
    selector: 'app-supermarkets',
    imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    TranslateModule
],
    template: `
    <div class="page-container animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">{{ 'SUPERMARKETS.TITLE' | translate }}</h1>
        <button mat-flat-button color="primary" (click)="openAddDialog()">
          <mat-icon>add</mat-icon>
          {{ 'SUPERMARKETS.ADD_BUTTON' | translate }}
        </button>
      </header>

      @if (isLoading) {
        <div class="skeleton-list">
          @for (i of [1,2,3]; track i) {
            <div class="skeleton card-skeleton"></div>
          }
        </div>
      } @else {
        <div class="market-grid">
          @for (market of supermarkets; track market.id) {
            <mat-card class="premium-card market-card">
              <mat-card-content>
                <div class="market-info">
                  <div class="market-icon">
                    <mat-icon>storefront</mat-icon>
                  </div>
                  <h3 class="market-name">{{ market.name }}</h3>
                </div>
              </mat-card-content>
            </mat-card>
          } @empty {
            <div class="empty-state">
              <mat-icon>store</mat-icon>
              <p>{{ 'SUPERMARKETS.EMPTY' | translate }}</p>
            </div>
          }
        </div>
      }
    </div>
  `,
    styles: [`
    .page-container {
      padding: 1.5rem;
      max-width: 800px;
      margin: 0 auto;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      .page-title { margin: 0; font-weight: 800; font-size: 2rem; }
    }
    .market-grid { display: flex; flex-direction: column; gap: 1rem; }
    .market-card {
      mat-card-content {
        display: flex;
        align-items: center;
        padding: 1rem !important;
      }
    }
    .market-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      .market-icon {
        width: 40px;
        height: 40px;
        background: rgba(var(--primary-rgb), 0.1);
        color: var(--primary-color);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .market-name { margin: 0; font-weight: 700; }
    }
    .skeleton-list { display: flex; flex-direction: column; gap: 1rem; }
    .card-skeleton { height: 64px; border-radius: 16px; }
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--text-muted);
      mat-icon { font-size: 4rem; width: 4rem; height: 4rem; opacity: 0.2; margin-bottom: 1rem; }
    }
  `]
})
export class SupermarketsComponent implements OnInit {
  supermarkets: Supermarket[] = [];
  isLoading = true;

  constructor(
    private supermarketService: SupermarketService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadSupermarkets();
  }

  loadSupermarkets(): void {
    this.isLoading = true;
    this.supermarketService.getAll().subscribe({
      next: (data) => {
        this.supermarkets = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(SupermarketFormDialogComponent, {
      width: '400px',
      maxWidth: '95vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Supermarket created!', 'OK', { duration: 3000 });
        this.loadSupermarkets();
      }
    });
  }
}
