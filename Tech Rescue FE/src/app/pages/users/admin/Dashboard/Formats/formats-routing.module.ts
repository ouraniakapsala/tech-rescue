import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { FormatsListComponent } from './formats-list/formats-list.component';
import { FormatsFormComponent } from './formats-form/formats-form.component';

const routes: Routes = [
  {
    path: '',
    component: FormatsListComponent
  },
  {
    path: 'create',
    component: FormatsFormComponent
  },
  {
    path: 'edit/:id',
    component: FormatsFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormatsRoutingModule { }
