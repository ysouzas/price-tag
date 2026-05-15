import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { SupabaseService } from '@core/services/supabase.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export interface Purchase {
  id: string;
  product_id: string;
  product_barcode: string;
  supermarket_id: string;
  price: number;
  purchased_at: string;
  supermarket?: { name: string };
}

@Component({
  selector: 'app-price-history',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatIconModule,
    TranslateModule,
  ],
  templateUrl: './price-history.component.html',
  styleUrl: './price-history.component.scss'
})
export class PriceHistoryComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input({ required: true }) barcode!: string;
  @Input() productId?: string;
  @ViewChild('priceChart') chartCanvas!: ElementRef<HTMLCanvasElement>;

  purchases: Purchase[] = [];
  isLoading = true;
  private chart: Chart | null = null;

  constructor(
    private supabaseService: SupabaseService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.loadPurchases();
  }

  ngAfterViewInit(): void {
    // Chart will be initialized once data is loaded
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  loadPurchases(): void {
    this.isLoading = true;
    const query = this.supabaseService.client
      .from('Purchases')
      .select('*, supermarket:Supermarkets(name)');

    if (this.productId) {
      query.eq('product_id', this.productId);
    } else {
      query.eq('product_barcode', this.barcode);
    }

    from(
      query.order('purchased_at', { ascending: false }).limit(20)
    ).pipe(
      map(res => {
        if (res.error) { console.error(res.error); return []; }
        return res.data as Purchase[];
      })
    ).subscribe(data => {
      this.purchases = data;
      this.isLoading = false;
      // Use setTimeout to allow Angular to render the canvas before initializing the chart
      setTimeout(() => this.updateChart(), 0);
    });
  }

  private updateChart(): void {
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Filter and sort data for the chart (oldest to newest)
    const chartData = [...this.purchases]
      .sort((a, b) => new Date(a.purchased_at).getTime() - new Date(b.purchased_at).getTime());

    if (chartData.length < 2) {
      if (this.chart) this.chart.destroy();
      this.chart = null;
      return;
    }

    const labels = chartData.map(p => new Date(p.purchased_at).toLocaleDateString());
    const prices = chartData.map(p => p.price);

    if (this.chart) {
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = prices;
      this.chart.update();
    } else {
      const isDark = this.document.body.classList.contains('theme-dark');
      const textColor = isDark ? '#94a3b8' : '#64748b';
      const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Price Trend',
            data: prices,
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#6366f1',
            borderWidth: 3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: isDark ? '#334155' : '#1e293b',
              titleFont: { family: 'Outfit', size: 13 },
              bodyFont: { family: 'Inter', size: 12 },
              padding: 12,
              displayColors: false,
              callbacks: {
                label: (context) => `€${(context.parsed.y ?? 0).toFixed(2)}`
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { 
                font: { family: 'Inter', size: 10, weight: 500 },
                color: textColor
              }
            },
            y: {
              grid: { color: gridColor },
              ticks: { 
                font: { family: 'Inter', size: 10, weight: 500 },
                color: textColor,
                callback: (value) => `€${value}`
              }
            }
          }
        }
      });
    }
  }
}
