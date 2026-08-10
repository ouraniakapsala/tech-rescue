import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProducersListComponent } from './producers-list/producers-list.component';
import { ProducersFormComponent } from './producers-form/producers-form.component';

const routes: Routes = [
  { path: '',
    component: ProducersListComponent
  },        // List View
  { path: 'create',
    component: ProducersFormComponent
  },  // Add New
  { path: 'edit/:id',
    component: ProducersFormComponent
  } // Edit Existing
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProducersRoutingModule { }
