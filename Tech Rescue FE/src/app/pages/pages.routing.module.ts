import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from '../auth/_services/auth-guard.service';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./users/admin/admin.module')
      .then(m => m.AdminModule)
  },
  {
    path: 'producer',
    loadChildren: () => import('./users/producers/producer.module')
      .then(m => m.ProducerModule)
  },
  {
    path: 'entity',
    loadChildren: () => import('./users/entity/entity.module')
      .then(m => m.EntityModule)
  },
  // {
  //   path: 'admin',
  //   loadChildren: () => import('./admin/admin.module')
  //     .then(m => m.AdminModule),
  // },
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
