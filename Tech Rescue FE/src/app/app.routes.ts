import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuardService } from './auth/_services/auth-guard.service';
import {LandingPageComponent} from './pages/landing-page/landing-page.component';

export const routes: Routes = [

  // 1. Auth Module (Δημόσιο)
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },

  // 2. Admin Route (Προστατευμένο)
  {
    path: 'admin',
    canActivate: [AuthGuardService],
    data: { roles: ['admin'] },
    loadChildren: () => import('./pages/users/admin/admin.module').then(m => m.AdminModule),
  },

  // 3. Producer Route (Προστατευμένο)
  {
    path: 'producer',
    canActivate: [AuthGuardService],
    data: { roles: ['producer'] },
    loadChildren: () => import('./pages/users/producers/producer.module').then(m => m.ProducerModule),
  },

  {
    path: 'entity',
    canActivate: [AuthGuardService],
    data: { roles: ['entity'] },
    loadChildren: () => import('./pages/users/entity/entity.module').then(m => m.EntityModule),
  },

  // {
  //   path: 'entities',
  //   canActivate: [AuthGuardService],
  //   data: {roles: ['entity']},
  //   loadChildren: () => import(./pages/users/entities/)
  //
  // },

  // 4. Default Route (Κενό URL -> Login)
  // { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  //
  // // 5. Fallback Wildcard (ΠΡΕΠΕΙ ΝΑ ΕΙΝΑΙ ΠΑΝΤΑ ΤΕΛΕΥΤΑΙΟ)
  // { path: '**', redirectTo: 'auth/login' }

  {
    path: '',
    component: LandingPageComponent,
    pathMatch: 'full'
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
