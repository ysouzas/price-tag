import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { SupermarketService, Supermarket } from '@services/supermarket/supermarket.service';

@Component({
    selector: 'app-supermarket-form-dialog',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        TranslateModule
    ],
    template: `
    <h2 mat-dialog-title>{{ 'SUPERMARKET.CREATE_TITLE' | translate }}</h2>
    <mat-dialog-content>
      <form [formGroup]="marketForm" class="dialog-form">
        <mat-form-field appearance="outline">
          <mat-label>{{ 'SUPERMARKET.NAME' | translate }}</mat-label>
          <input matInput formControlName="name" placeholder="Supermarket name" />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">{{ 'COMMON.CANCEL' | translate }}</button>
      <button mat-flat-button color="primary" 
              [disabled]="marketForm.invalid || isSaving" 
              (click)="onSave()">
        {{ 'COMMON.SAVE' | translate }}
      </button>
    </mat-dialog-actions>
  `,
    styles: [`
    .dialog-form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding-top: 0.5rem;
      min-width: 300px;
    }
    mat-form-field { width: 100%; }
  `]
})
export class SupermarketFormDialogComponent {
  marketForm: FormGroup;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private supermarketService: SupermarketService,
    private dialogRef: MatDialogRef<SupermarketFormDialogComponent>
  ) {
    this.marketForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.marketForm.valid) {
      this.isSaving = true;
      this.supermarketService.create(this.marketForm.get('name')?.value).subscribe({
        next: (market: Supermarket) => {
          this.dialogRef.close(market);
        },
        error: (err: any) => {
          console.error(err);
          this.isSaving = false;
        }
      });
    }
  }
}
