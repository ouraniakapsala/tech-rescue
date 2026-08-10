import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProducerOverviewComponent } from './Dashboard/producer-overview/producer-overview.component';
import { ProducerProfileComponent } from './Dashboard/producer-profile/producer-profile.component';
import {ProducerDashboardComponent} from './Dashboard/producerDashboard.component';

const routes: Routes = [
  {
    path: '',
    component: ProducerDashboardComponent, // <--- Φορτώνει πρώτα το Layout (Sidebar + Header)
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      {
        path: 'overview',
        loadChildren: () => import('./Dashboard/producer-overview/producer-overview.module').then(m => m.ProducerOverviewModule)
      },
      {
        path: 'donations',
        loadChildren: () => import('./Dashboard/Donations/donations.module').then(m => m.DonationsModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./Dashboard/producer-profile/producer-profile.module').then(m => m.ProducerProfileModule)
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProducerRoutingModule { }
