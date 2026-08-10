import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProducerRoutingModule } from './producer-routing.module';
import { ProducerOverviewComponent } from './Dashboard/producer-overview/producer-overview.component';
import {ProducerDashboardComponent} from './Dashboard/producerDashboard.component';
import {ThemeModule} from '../../../@themes/theme.module';
import {MatButton} from '@angular/material/button';


@NgModule({
  declarations: [
    // ProducerOverviewComponent,
    ProducerDashboardComponent,
    // ProducerProfileComponent // Declare here if it's not in its own module
  ],
  imports: [
    CommonModule,
    ProducerRoutingModule,
    ThemeModule,
    MatButton
  ]
})
export class ProducerModule { }
