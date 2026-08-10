import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  standalone: false
})
export class LandingPageComponent {

  isLightboxOpen = false;
  activeLightboxImage = '';
  isZoomed = false;


  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  openLightbox(imageSrc: string) {
    this.activeLightboxImage = imageSrc;
    this.isLightboxOpen = true;
    this.isZoomed = false; // Αρχικά η εικόνα δεν είναι ζουμαρισμένη

    // Κλειδώνουμε το scroll της σελίδας όταν είναι ανοιχτό το fullscreen
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.isLightboxOpen = false;
    this.activeLightboxImage = '';

    // Επαναφέρουμε το scroll της σελίδας
    document.body.style.overflow = 'auto';
  }

  toggleZoom() {
    this.isZoomed = !this.isZoomed;
  }
}
