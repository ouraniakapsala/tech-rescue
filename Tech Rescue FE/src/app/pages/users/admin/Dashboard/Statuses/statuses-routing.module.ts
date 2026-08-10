import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { StatusesListComponent } from './statuses-list/statuses-list.component';
import { StatusesFormComponent } from './statuses-form/statuses-form.component';

const routes: Routes = [
  {
    path: '',
    component: StatusesListComponent
  },
  {
    path: 'create',
    component: StatusesFormComponent
  },
  {
    path: 'edit/:id',
    component: StatusesFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatusesRoutingModule { }
