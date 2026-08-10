import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/_services/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  standalone: false
})
export class SidenavComponent implements OnInit {

  isAdmin = false;
  isProducer = false;
  isEntity = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const role = this.authService.getRole();
    this.isAdmin = (role === 'admin');
    this.isProducer = (role === 'producer');
    this.isEntity = (role === 'entity');
  }
}
