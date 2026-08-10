import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Material Imports
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';

import { ProducersRoutingModule } from './producers-routing.module';
import { ProducersListComponent } from './producers-list/producers-list.component';
import { ProducersFormComponent } from './producers-form/producers-form.component';
import {MatSlideToggle, MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTooltip} from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDividerModule} from '@angular/material/divider';
import {MatOption, MatSelect, MatSelectModule} from "@angular/material/select";

@NgModule({
  declarations: [
    ProducersListComponent,
    ProducersFormComponent
  ],
  imports: [
    CommonModule,
    ProducersRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatSlideToggle,
    MatPaginator,
    MatPaginatorModule,
    MatTooltip,
    MatTabsModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatSelect,
    MatOption,
    MatSelectModule
  ]
})
export class ProducersModule { }
