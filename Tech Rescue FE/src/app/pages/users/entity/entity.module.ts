import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material Modules για το Layout (Sidebar, Toolbar κλπ)
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

// Routing & Components
import { EntityRoutingModule } from './entity-routing.module';
import { EntityDashboardComponent } from './Dashboard/entity-dashboard.component';

// Αν έχεις Shared Components (π.χ. το Header που φτιάξαμε πριν)
// import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  declarations: [
    EntityDashboardComponent // Το component που περιέχει το <router-outlet> για τα παιδιά (Overview, Profile κλπ)
  ],
  imports: [
    CommonModule,
    EntityRoutingModule,

    // Material
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule
  ]
})
export class EntityModule { }
