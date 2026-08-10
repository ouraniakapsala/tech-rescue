import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Material Modules (Ιδανικά για Dashboard/Statistics)
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar'; // Χρήσιμο για "στόχους" ή φόρτωση

// Component
import { EntityOverviewComponent } from './entity-overview.component';
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatTooltip} from '@angular/material/tooltip';

@NgModule({
  declarations: [
    EntityOverviewComponent
  ],
  imports: [
    CommonModule,

    // Εσωτερικό Routing: Όταν φορτώνεται το module, δείχνει αμέσως το Component
    RouterModule.forChild([
      {path: '', component: EntityOverviewComponent}
    ]),

    // Material
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressBarModule,
    MatProgressSpinner,
    MatTooltip
  ]
})
export class EntityOverviewModule { }
