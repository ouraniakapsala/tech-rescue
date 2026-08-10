import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DonationsService } from '../../../../../../_services/donations.service';

@Component({
  selector: 'app-donations-form',
  templateUrl: './donations-form.component.html',
  styleUrls: ['./donations-form.component.css'],
  standalone: false
})
export class DonationsFormComponent implements OnInit {
  acceptForm!: FormGroup;
  donationId: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private donationsService: DonationsService
  ) {}

  ngOnInit(): void {
    this.donationId = this.route.snapshot.paramMap.get('id');

    this.acceptForm = this.fb.group({
      locationName: ['', Validators.required],
      contactName: ['', Validators.required],
      contactPhone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['Greece', Validators.required],
      description: [''],
      lat: [null],
      lng: [null]
    });
  }

  onSubmit(): void {
    if (this.acceptForm.invalid || !this.donationId) {
      this.acceptForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValues = this.acceptForm.value;

    const payload = {
      entitylocation: {
        locationName: formValues.locationName,
        contactName: formValues.contactName,
        contactPhone: formValues.contactPhone,
        country: formValues.country,
        city: formValues.city,
        zipCode: formValues.zipCode,
        address: formValues.address,
        lat: formValues.lat,
        lng: formValues.lng,
      },
      transporter: {}
    };

    this.donationsService.acceptDonation(this.donationId, payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.router.navigate(['/entity/donations']);
      },
      error: (err) => {
        console.error('Σφάλμα:', err);
        this.isLoading = false;
        alert('Υπήρξε πρόβλημα κατά τη δέσμευση της δωρεάς.');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/entity/donations']);
  }
}
