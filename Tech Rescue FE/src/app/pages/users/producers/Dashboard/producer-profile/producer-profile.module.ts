import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Material Modules (Ιδανικά για Φόρμες Προφίλ)
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

// Routing & Components
import { ProducerProfileComponent } from './producer-profile.component';
import {RouterModule} from '@angular/router';
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatTab, MatTabGroup, MatTabLabel} from '@angular/material/tabs';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatTooltip} from "@angular/material/tooltip";

@NgModule({
  declarations: [
    ProducerProfileComponent
  ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule.forChild([
            {path: '', component: ProducerProfileComponent}
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
        MatTabGroup,
        MatTabLabel,
        MatCheckbox,
        MatTooltip
    ]
})
export class ProducerProfileModule { }
