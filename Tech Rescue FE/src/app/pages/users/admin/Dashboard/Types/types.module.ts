import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Routing
import { TypesRoutingModule } from './types-routing.module';

// Components
import { TypesListComponent } from './types-list/types-list.component';
import { TypesFormComponent } from './types-form/types-form.component';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    TypesListComponent,
    TypesFormComponent // ✅ Confirmed declaration
  ],
  imports: [
    CommonModule,
    TypesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,

    // Material Modules
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatFormFieldModule, // ✅ Required for labels to appear
    MatInputModule,     // ✅ Required for inputs to style correctly
    MatSelectModule,    // ✅ Required for the dropdown
    MatSlideToggleModule,
    MatTooltipModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ]
})
export class TypesModule { }
