import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DonationsListComponent } from './donations-list/donations-list.component';
// import { DonationsFormComponent } from './donations-form/donations-form.component';

const routes: Routes = [
  {
    path: '',
    component: DonationsListComponent
  },
  // {
  //   path: 'create',
  //   component: DonationsFormComponent
  // },
  // {
  //   path: 'edit/:id',
  //   component: DonationsFormComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DonationsRoutingModule { }
