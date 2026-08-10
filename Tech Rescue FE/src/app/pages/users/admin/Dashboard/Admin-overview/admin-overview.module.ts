import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { AdminOverviewComponent } from './admin-overview.component';
import {MatDivider} from '@angular/material/list';

// Define the route for this module locally
const routes: Routes = [
  { path: '', component: AdminOverviewComponent }
];

@NgModule({
  declarations: [
    AdminOverviewComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), // Connects the route

    // Material Modules specific to this page
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatDivider
  ]
})
export class AdminOverviewModule { }
