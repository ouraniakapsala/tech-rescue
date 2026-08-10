import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material Modules (Ιδανικά για Dashboard/Overview)
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list'; // Χρήσιμο για στατιστικά

// Routing & Components
// import { ProducerOverviewRoutingModule } from './producer-overview-routing.module';
import { ProducerOverviewComponent } from './producer-overview.component';
import {RouterLink, RouterModule} from '@angular/router';
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatTooltip} from '@angular/material/tooltip';

@NgModule({
  declarations: [
    ProducerOverviewComponent
  ],
  imports: [
    CommonModule,
    // ProducerOverviewRoutingModule,

    // Material
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatGridListModule,
    RouterLink,
    RouterModule.forChild([
      {path: '', component: ProducerOverviewComponent}
    ]),
    MatProgressSpinner,
    MatTooltip
  ]
})
export class ProducerOverviewModule { }
