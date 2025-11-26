import { Component, input, computed, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA, effect } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Sample } from '../../models/sample.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardComponent {
  readonly samples = input.required<Sample[]>();
  
  Highcharts: typeof Highcharts = Highcharts;
  
  constructor() {
    // Render charts when samples change
    effect(() => {
      const samples = this.samples();
      if (samples.length > 0) {
        setTimeout(() => {
          this.renderCharts();
        }, 0);
      }
    });
  }
  
  private renderCharts() {
    Highcharts.chart('chart-cost-currency', this.costByCurrencyOptions());
    Highcharts.chart('chart-status-dist', this.statusDistributionOptions());
    Highcharts.chart('chart-entity', this.samplesByEntityOptions());
  }

  // Chart 1: Total cost by currency
  protected readonly costByCurrencyOptions = computed(() => {
    const samples = this.samples();
    const costMap = new Map<string, number>();
    
    samples.forEach(sample => {
      if (sample.costOfSample?.currencyCode && sample.costOfSample?.content) {
        const currency = sample.costOfSample.currencyCode;
        const cost = parseFloat(sample.costOfSample.content);
        costMap.set(currency, (costMap.get(currency) || 0) + cost);
      }
    });

    const data = Array.from(costMap.entries()).map(([name, y]) => ({ name, y }));
    
    return {
      chart: {
        type: 'pie',
        height: 200
      },
      title: {
        text: 'Total Cost by Currency',
        style: { fontSize: '14px', fontWeight: 'bold' }
      },
      tooltip: {
        pointFormat: '<b>{point.y:,.0f}</b> ({point.percentage:.1f}%)'
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.y:,.0f}'
          }
        }
      },
      series: [{
        type: 'pie',
        name: 'Cost',
        colorByPoint: true,
        data: data.length > 0 ? data : [{ name: 'No data', y: 1 }]
      }],
      credits: {
        enabled: false
      }
    } as any;
  });

  // Chart 2: Sample status distribution
  protected readonly statusDistributionOptions = computed(() => {
    const samples = this.samples();
    const statusMap = new Map<string, number>();
    
    samples.forEach(sample => {
      const status = sample.status || 'Unknown';
      statusMap.set(status, (statusMap.get(status) || 0) + 1);
    });

    const data = Array.from(statusMap.entries()).map(([name, y]) => ({ name, y }));
    
    return {
      chart: {
        type: 'pie',
        height: 200
      },
      title: {
        text: 'Sample Status Distribution',
        style: { fontSize: '14px', fontWeight: 'bold' }
      },
      tooltip: {
        pointFormat: '<b>{point.y}</b> samples ({point.percentage:.1f}%)'
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.y}'
          }
        }
      },
      series: [{
        type: 'pie',
        name: 'Samples',
        colorByPoint: true,
        data: data.length > 0 ? data : [{ name: 'No data', y: 1 }]
      }],
      credits: {
        enabled: false
      }
    } as any;
  });

  // Chart 3: Samples by account
  protected readonly samplesByEntityOptions = computed(() => {
    const samples = this.samples();
    
    // Group by account
    const accountMap = new Map<string, number>();
    
    samples.forEach(sample => {
      if (sample.account?.name) {
        const name = sample.account.name;
        accountMap.set(name, (accountMap.get(name) || 0) + 1);
      }
    });

    const data = Array.from(accountMap.entries()).map(([name, y]) => ({ name, y }));
    
    return {
      chart: {
        type: 'pie',
        height: 200
      },
      title: {
        text: 'Samples by Account',
        style: { fontSize: '14px', fontWeight: 'bold' }
      },
      tooltip: {
        pointFormat: '<b>{point.y}</b> samples ({point.percentage:.1f}%)'
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.y}'
          }
        }
      },
      series: [{
        type: 'pie',
        name: 'Samples',
        colorByPoint: true,
        data: data.length > 0 ? data : [{ name: 'No data', y: 1 }]
      }],
      credits: {
        enabled: false
      }
    } as any;
  });
}
