import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Routing
import { DonationsRoutingModule } from './dontations-routing.module';

// Components
import { DonationsListComponent } from './donations-list/donations-list.component';
import { DonationsFormComponent } from './donations-form/donations-form.component';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatSnackBarModule } from '@angular/material/snack-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatPaginator} from '@angular/material/paginator';
import {DonationsDetailsComponent} from './donations-details/donations-details.component';
import {MatDialogActions, MatDialogContent} from '@angular/material/dialog';

@NgModule({
  declarations: [
    DonationsListComponent,
    DonationsFormComponent,
    DonationsDetailsComponent
  ],
  imports: [
    CommonModule,
    DonationsRoutingModule,
    ReactiveFormsModule, // Απαραίτητο για τη φόρμα αποδοχής
    FormsModule,

    // Material Modules
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    // MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTooltipModule,
    MatPaginator,
    MatDialogContent,
    MatDialogActions
  ]
})
export class DonationsModule { }
