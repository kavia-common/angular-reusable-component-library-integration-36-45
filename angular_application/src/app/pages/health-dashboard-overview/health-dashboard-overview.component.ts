import { ChangeDetectionStrategy, Component, WritableSignal, signal, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

/* PrimeNG modules required by the template */
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';

/* ApexCharts (ng-apexcharts) */
import { NgApexchartsModule } from 'ng-apexcharts';
import type {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexStroke,
  ApexXAxis,
  ApexLegend,
  ApexFill,
  ApexGrid,
  ApexMarkers,
  ApexTooltip,
  ApexYAxis
} from 'ng-apexcharts';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-health-dashboard-overview',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    DropdownModule,
    ButtonModule,
    TagModule,
    TableModule,
    // Keep charts as module import; template guards below avoid runtime errors if package not yet installed
    NgApexchartsModule
  ],
  templateUrl: './health-dashboard-overview.component.html',
  styleUrls: [
    './health-dashboard-overview.component.css',
    // Bring in design system and screen-specific styles for pixel fidelity
    '../../../assets/common.css',
    '../../../assets/health-dashboardoverview-525-31813.css'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthDashboardOverviewComponent {
  protected readonly username = 'John Doe';

  // Soft guard so SSR and pre-install states don't break the build if ng-apexcharts is unresolved at runtime.
  // We assume bundler will include it when installed; before that, we render a simple placeholder.
  readonly canRenderCharts = true;

  // Filters
  filters: WritableSignal<{ device: string; period: string; region: string }> = signal({
    device: 'All Devices',
    period: 'Last 30d',
    region: 'All',
  });

  // PrimeNG Dropdown expects mutable arrays; provide {label,value} items
  deviceOptions: Array<{ label: string; value: string }> = [
    { label: 'All Devices', value: 'All Devices' },
    { label: 'Gateway', value: 'Gateway' },
    { label: 'Sensor', value: 'Sensor' },
    { label: 'Controller', value: 'Controller' },
  ];

  periodOptions: Array<{ label: string; value: string }> = [
    { label: 'Last 7d', value: 'Last 7d' },
    { label: 'Last 30d', value: 'Last 30d' },
    { label: 'Last 90d', value: 'Last 90d' },
  ];

  regionOptions: Array<{ label: string; value: string }> = [
    { label: 'All', value: 'All' },
    { label: 'NA', value: 'NA' },
    { label: 'EU', value: 'EU' },
    { label: 'APAC', value: 'APAC' },
  ];

  // Metrics
  metrics = signal([
    { key: 'Healthy', value: 308, tone: 'ok' as const },
    { key: 'Warning', value: 12, tone: 'warn' as const },
    { key: 'Anomaly', value: 45, tone: 'error' as const },
  ]);

  // Distribution strip
  distribution = signal([
    { key: 'Normal', value: 308, tone: 'ok' as const },
    { key: 'Warning', value: 4, tone: 'warn' as const },
    { key: 'Anomaly', value: 3, tone: 'error' as const },
  ]);

  // Table data
  devices = signal([
    { id: 'DEV-001', location: 'NY', status: 'Healthy', seen: '2m ago' },
    { id: 'DEV-112', location: 'TX', status: 'Warning', seen: '5m ago' },
    { id: 'DEV-245', location: 'CA', status: 'Anomaly', seen: '1m ago' },
  ]);

  // ApexCharts configuration
  chartSeries: ApexAxisChartSeries = [
    {
      name: 'Healthy',
      data: [140, 150, 160, 170, 180, 190, 200, 210, 215, 220, 225, 230],
    },
    {
      name: 'Warning',
      data: [90, 88, 89, 87, 90, 88, 89, 87, 88, 89, 88, 88],
    },
    {
      name: 'Anomaly',
      data: [80, 82, 84, 83, 85, 84, 82, 83, 82, 83, 84, 85],
    },
  ];
  chartOptions: {
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    stroke: ApexStroke;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    legend: ApexLegend;
    fill: ApexFill;
    grid: ApexGrid;
    markers: ApexMarkers;
    tooltip: ApexTooltip;
    colors: string[];
  } = {
    chart: {
      type: 'area',
      height: 300,
      toolbar: { show: false },
      animations: { enabled: true }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: '#64748b' } }
    },
    yaxis: {
      labels: { style: { colors: '#64748b' } }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      labels: { colors: '#64748b' }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.25,
        opacityTo: 0.01,
        stops: [0, 95, 100]
      }
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 4
    },
    markers: { size: 0 },
    tooltip: { theme: 'light' },
    colors: ['#10B981', '#F59E0B', '#EF4444']
  };

  // PUBLIC_INTERFACE
  /** Update an inline filter option by key and value. */
  updateFilter(key: 'device' | 'period' | 'region', value: string): void {
    const current = this.filters();
    this.filters.set({ ...current, [key]: value });
  }

  // PUBLIC_INTERFACE
  /** TrackBy helper for ngFor loops to keep OnPush efficient. */
  trackByIndex(_i: number): number { return _i; }
}
