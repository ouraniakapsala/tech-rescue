import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from './login/login.component';
import {AuthRoutingModule} from './auth-routing.module';
import {MatIcon} from "@angular/material/icon";

@NgModule({
  declarations: [ LoginComponent
    // ✅ Declare it here
  ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        AuthRoutingModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIcon,
    ]
})
export class AuthModule {}
