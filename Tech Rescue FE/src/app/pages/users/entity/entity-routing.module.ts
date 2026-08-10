import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntityDashboardComponent } from './Dashboard/entity-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: EntityDashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      {
        path: 'overview',
        loadChildren: () => import('./Dashboard/Entity-overview/entity-overview.module').then(m => m.EntityOverviewModule)
      },
      {
        path: 'donations',
        loadChildren: () => import('./Dashboard/Donations/donations.module').then(m => m.DonationsModule)
      },
      {
        path: 'profile',
        loadChildren: () =>import('./Dashboard/Entity-profile/entity-profile.module').then(m => m.EntityProfileModule)
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntityRoutingModule { }
