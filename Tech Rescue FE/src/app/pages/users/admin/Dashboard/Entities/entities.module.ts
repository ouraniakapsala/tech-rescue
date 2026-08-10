import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EntitiesRoutingModule } from './entities-routing.module';

// Components
import { EntitiesListComponent } from './entities-list/entities-list.component';
import { EntitiesFormComponent } from './entities-form/entities-form.component';

// Angular Material Modules (Όλα όσα χρειάζονται τα HTML σου)
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    EntitiesListComponent,
    EntitiesFormComponent
  ],
  imports: [
    CommonModule,
    EntitiesRoutingModule,
    ReactiveFormsModule,
    FormsModule,

    // Material
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatDividerModule,
    MatPaginatorModule,
    MatTooltipModule
  ]
})
export class EntitiesModule { }
