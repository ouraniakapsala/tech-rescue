import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PagesRoutingModule} from './pages.routing.module';
import {LandingPageComponent} from './landing-page/landing-page.component';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';

@NgModule({
  declarations: [LandingPageComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    MatIcon,
    MatButton
  ],
})
export class PagesModule {
}
