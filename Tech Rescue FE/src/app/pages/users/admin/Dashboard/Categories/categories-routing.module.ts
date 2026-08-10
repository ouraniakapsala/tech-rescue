import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesListComponent} from './categories-list/categories-list.component';
import { CategoriesFormComponent } from './categories-form/categories-form.component';

const routes: Routes = [
  { path: '',
    component: CategoriesListComponent
  },          // /categories → list
  { path: 'create',
    component: CategoriesFormComponent
  }, // /categories/create → form
  { path: 'edit/:id',
    component: CategoriesFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
