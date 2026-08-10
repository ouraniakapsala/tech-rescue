import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// Material Modules (Ιδανικά για Φόρμες Προφίλ)
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

// Component
import { EntityProfileComponent } from './entity-profile.component';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatTab, MatTabGroup, MatTabLabel} from "@angular/material/tabs";
import {MatCheckbox} from '@angular/material/checkbox';

@NgModule({
  declarations: [
    EntityProfileComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    // Εσωτερικό Routing για το Profile
    RouterModule.forChild([
      {path: '', component: EntityProfileComponent}
    ]),

    // Material
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDividerModule,
    MatProgressSpinner,
    MatTab,
    MatTabLabel,
    MatTabGroup,
    MatCheckbox
  ]
})
export class EntityProfileModule { }
