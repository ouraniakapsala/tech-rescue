import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntitiesListComponent } from './entities-list/entities-list.component';
import { EntitiesFormComponent } from './entities-form/entities-form.component';

const routes: Routes = [
  {
    path: '',
    component: EntitiesListComponent
  },
  {
    path: 'create',
    component: EntitiesFormComponent
  },
  {
    path: 'edit/:id',
    component: EntitiesFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntitiesRoutingModule { }
