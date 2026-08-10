import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministratorsListComponent } from './administrators-list/administrators-list.component';
import { AdministratorsFormComponent } from './administrators-form/administrators-form.component';

const routes: Routes = [
  { path: '', component: AdministratorsListComponent },
  { path: 'create', component: AdministratorsFormComponent },
  { path: 'edit/:id', component: AdministratorsFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministratorsRoutingModule { }
