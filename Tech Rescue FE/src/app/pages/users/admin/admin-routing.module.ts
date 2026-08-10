import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './Dashboard/adminDashboard.component';
import { AuthGuardService } from '../../../auth/_services/auth-guard.service';

// @ts-ignore
const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      { path: 'categories',   // lowercase is best practice
        loadChildren: () =>
          import('./Dashboard/Categories/categories.module').then(m => m.CategoriesModule)
      },
      {
        path: 'formats',
        loadChildren: () => import('./Dashboard/Formats/formats.module').then(m => m.FormatsModule)
      },
      {
        path: 'statuses',
        loadChildren: () => import('./Dashboard/Statuses/statuses.module').then(m => m.StatusesModule)
      },
      {
        path: 'types',
        loadChildren: () => import('./Dashboard/Types/types.module').then(m => m.TypesModule)
      },
      {
        path: 'producers',
        loadChildren: () => import('./Dashboard/Producers/producers.module').then(m => m.ProducersModule)
      },
      {
        path: 'entities',
        loadChildren: () => import('./Dashboard/Entities/entities.module').then(m => m.EntitiesModule)
      },
      {
        path: 'overview',
        loadChildren: () => import('./Dashboard/Admin-overview/admin-overview.module').then(m => m.AdminOverviewModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./Dashboard/Admin-profile/admin-profile.module').then(m => m.AdminProfileModule)
      },
      {
        path: 'administrators',
        loadChildren: () => import('./Dashboard/Administrators/administrators.module').then(m => m.AdministratorsModule)
      },

      {
        path: 'donations',
        loadChildren: () => import('./Dashboard/Donations/donations.module').then(m => m.DonationsModule)
      },
      { path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
    ],
    canActivate: [AuthGuardService] // Protect admin pages
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
