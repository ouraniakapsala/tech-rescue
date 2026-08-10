import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// Material Imports (Only what this form needs)
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AdminProfileComponent } from './admin-profile.component';
import {MatMenu, MatMenuItem} from "@angular/material/menu";
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatTab, MatTabGroup, MatTabLabel} from '@angular/material/tabs';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatTooltip} from '@angular/material/tooltip';

// Define the route directly here since it's a simple one-page module
const routes: Routes = [
  { path: '', component: AdminProfileComponent }
];

@NgModule({
  declarations: [
    AdminProfileComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes), // This connects the route

    // Material
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatMenu,
    MatMenuItem,
    MatProgressSpinner,
    MatTabGroup,
    MatTab,
    MatTabLabel,
    MatCheckbox,
    MatTooltip
  ]
})
export class AdminProfileModule { }
