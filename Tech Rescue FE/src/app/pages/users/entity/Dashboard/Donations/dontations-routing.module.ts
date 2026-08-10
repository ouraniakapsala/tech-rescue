import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DonationsListComponent } from './donations-list/donations-list.component';
import { DonationsFormComponent } from './donations-form/donations-form.component';
import {DonationsDetailsComponent} from './donations-details/donations-details.component';

const routes: Routes = [
  {
    path: '',
    component: DonationsListComponent // Η αρχική σελίδα του Marketplace
  },
  {
    path: 'accept/:id',
    component: DonationsFormComponent // Η σελίδα με τη φόρμα αποδοχής
  },
  {
    path: 'details/:id',
    component: DonationsDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DonationsRoutingModule { }
