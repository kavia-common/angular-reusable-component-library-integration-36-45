import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'health-dashboard/overview',
  },
  {
    path: 'health-dashboard/overview',
    loadComponent: () =>
      import('./pages/health-dashboard-overview/health-dashboard-overview.component').then(
        (m) => m.HealthDashboardOverviewComponent,
      ),
  },
];
