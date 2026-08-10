import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FormatsRoutingModule } from './formats-routing.module';

// Components
import { FormatsListComponent } from './formats-list/formats-list.component';
import { FormatsFormComponent } from './formats-form/formats-form.component';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    FormatsListComponent,
    FormatsFormComponent
  ],
  imports: [
    // Core Angular
    CommonModule,
    FormatsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,

    // Material UI
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ]
})
export class FormatsModule { }
