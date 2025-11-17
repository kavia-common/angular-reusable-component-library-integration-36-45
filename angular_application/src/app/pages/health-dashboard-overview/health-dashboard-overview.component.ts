import { ChangeDetectionStrategy, Component, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-health-dashboard-overview',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './health-dashboard-overview.component.html',
  styleUrls: ['./health-dashboard-overview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthDashboardOverviewComponent {
  protected readonly username = 'John Doe';

  // Filters
  filters: WritableSignal<{ device: string; period: string; region: string }> = signal({
    device: 'All Devices',
    period: 'Last 30d',
    region: 'All',
  });

  deviceOptions = ['All Devices', 'Gateway', 'Sensor', 'Controller'] as const;
  periodOptions = ['Last 7d', 'Last 30d', 'Last 90d'] as const;
  regionOptions = ['All', 'NA', 'EU', 'APAC'] as const;

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
