import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesFormComponent } from './categories-form/categories-form.component';
import { CategoriesRoutingModule } from './categories-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {CategoriesListComponent} from './categories-list/categories-list.component';
import {MatTooltip} from '@angular/material/tooltip';
import {MatPaginator} from '@angular/material/paginator';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatDivider} from "@angular/material/list";

@NgModule({
  declarations: [
    CategoriesListComponent, CategoriesFormComponent
  ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatInputModule,
        MatCardModule,
        MatIconModule,
        CategoriesRoutingModule,
        FormsModule,
        MatTooltip,
        MatPaginator,
        MatSlideToggle,
        MatProgressSpinner,
        MatDivider,
        // CategoriesFormComponent
    ]
})
export class CategoriesModule { }
