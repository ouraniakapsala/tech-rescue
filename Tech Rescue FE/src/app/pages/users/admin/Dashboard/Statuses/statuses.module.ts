import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Import the Routing Module
import { StatusesRoutingModule } from './statuses-routing.module';

// Components
import { StatusesListComponent } from './statuses-list/statuses-list.component';
import { StatusesFormComponent } from './statuses-form/statuses-form.component';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatDivider} from "@angular/material/list";

@NgModule({
  declarations: [
    StatusesListComponent,
    StatusesFormComponent
  ],
    imports: [
        CommonModule,
        StatusesRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,

        // Material
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatDivider
    ]
})
export class StatusesModule { }
