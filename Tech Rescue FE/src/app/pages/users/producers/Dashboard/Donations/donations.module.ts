import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Material Modules
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

// ΝΕΑ IMPORTS ΠΟΥ ΕΛΕΙΠΑΝ / ΔΙΟΡΘΩΘΗΚΑΝ
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';

// Routing & Components
import { DonationsRoutingModule } from './donations-routing.module';
import { DonationsListComponent } from './donations-list/donations-list.component';
import { DonationsFormComponent } from './donations-form/donations-form.component';

@NgModule({
  declarations: [
    DonationsListComponent,
    DonationsFormComponent
  ],
  imports: [
    CommonModule,
    DonationsRoutingModule,
    ReactiveFormsModule,
    FormsModule,

    // Material
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatTabsModule
  ]
})
export class DonationsModule { }
