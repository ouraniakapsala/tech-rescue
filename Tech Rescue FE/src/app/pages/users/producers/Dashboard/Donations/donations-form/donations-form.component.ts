import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DonationsService } from '../../../../../../_services/donations.service';
import { TypesService } from '../../../../../../_services/types.service';
import { FormatsService} from '../../../../../../_services/formats.service';
import { StatusesService} from '../../../../../../_services/statuses.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-donations-form',
  templateUrl: './donations-form.component.html',
  styleUrls: ['./donations-form.component.css'],
  standalone: false
})
export class DonationsFormComponent implements OnInit {

  donationForm!: FormGroup;
  isEditMode = false;
  donationId: string | null = null;
  isLoading = false;
  selectedTabIndex = 0;

  availableProducts: any[] = [];
  groupedProducts: { categoryName: string, products: any[] }[] = [];
  availableBoxes: any[] = [];
  availableStatuses: any[] = [];

  constructor(
    private fb: FormBuilder,
    private donationsService: DonationsService,
    private typesService: TypesService,
    private route :ActivatedRoute,
    private router :Router,
    private snackBar: MatSnackBar,
    private formatsService: FormatsService,
    private statusService: StatusesService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.donationId = this.route.snapshot.paramMap.get('id');

    // Αλλαγή Στρατηγικής: Φορτώνουμε ΠΡΩΤΑ τα Dropdowns
    this.loadInitialData();
  }

  initForm() {
    this.donationForm = this.fb.group({
      fullName: ['', Validators.required],
      contactPerson: ['', Validators.required],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      country: ['Greece'],
      description: [''],
      status: ['', Validators.required],

      items: this.fb.array([]),

      transporter: this.fb.group({
        own: [false],
        name: [''],
        phone: ['']
      }),

      producerlocation: this.fb.group({
        locationName: [''],
        contactName: [''],
        contactPhone: [''],
        country: ['Greece'],
        city: [''],
        zipCode: [''],
        address: ['', Validators.required],
        description: [''],
        lat: [null],
        lng: [null]
      })
    });
  }

  // --- ΣΥΓΧΡΟΝΙΣΜΕΝΗ ΦΟΡΤΩΣΗ (Το μυστικό για να δουλέψουν τα Selects) ---
  loadInitialData() {
    this.isLoading = true;

    // Ζητάμε και τα 3 dropdowns μαζί
    forkJoin({
      products: this.typesService.getAllTypes(),
      boxes: this.formatsService.getAllFormats(),
      statuses: this.statusService.getAllStatuses()
    }).subscribe({
      next: (results) => {
        // 1. Εξαγωγή των δεδομένων από τα APIs
        const allProducts = this.extractArray(results.products, 'Products');
        const allBoxes = this.extractArray(results.boxes, 'Boxes');
        const allStatuses = this.extractArray(results.statuses, 'Statuses');

        // 2. ΦΙΛΤΡΑΡΙΣΜΑ: Κρατάμε ΜΟΝΟ όσα είναι Ενεργά ΚΑΙ ΟΧΙ Διαγραμμένα
        this.availableProducts = allProducts.filter((p: any) => p.active === true && !p.delete);
        this.groupProducts();
        this.availableBoxes = allBoxes.filter((b: any) => b.active === true && !b.delete);
        this.availableStatuses = allStatuses.filter((p: any) => p.active === true && !p.delete);

        // // Τα statuses συνήθως τα χρειαζόμαστε όλα, οπότε δεν τα φιλτράρουμε
        // // (εκτός αν έχουν κι αυτά πεδίο active/delete στη βάση σου)
        // this.availableStatuses = this.extractArray(results.statuses, 'Statuses');

        // 3. ΤΩΡΑ που έχουμε τις καθαρές λίστες, ελέγχουμε αν είμαστε σε Edit Mode
        if (this.donationId) {
          this.isEditMode = true;
          this.loadDonationData();
        } else {
          this.addItem(); // Προσθήκη κενού προϊόντος για Create Mode
          this.isLoading = false;
        }
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Σφάλμα φόρτωσης λιστών:', err);
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  // Νέα μέθοδος για την ομαδοποίηση των προϊόντων ανά κατηγορία
  groupProducts() {
    const groups = new Map<string, any[]>();

    this.availableProducts.forEach(product => {
      // Βρίσκουμε το όνομα της κατηγορίας (αν δεν έχει, το βάζουμε στα "Λοιπά")
      const catName = product.category?.name || 'Λοιπά / Χωρίς Κατηγορία';

      if (!groups.has(catName)) {
        groups.set(catName, []);
      }
      groups.get(catName)?.push(product);
    });

    // Μετατρέπουμε το Map στον πίνακα που χρειάζεται το HTML
    this.groupedProducts = Array.from(groups.keys()).map(catName => {
      return {
        categoryName: catName,
        products: groups.get(catName) || []
      };
    });
  }

  // --- Η "ΑΤΡΩΤΗ" ΒΟΗΘΗΤΙΚΗ ΣΥΝΑΡΤΗΣΗ (Προσαρμοσμένη στα δικά σου APIs) ---
  private extractArray(res: any, nameForLog: string = ''): any[] {
    if (!res) return [];

    let parsedRes = res;

    // 1. Προστασία: Αν το API έστειλε τα δεδομένα σαν Κείμενο (String)
    if (typeof res === 'string') {
      try {
        parsedRes = JSON.parse(res);
      } catch (e) {
        console.error(`Αποτυχία parse στο ${nameForLog}`, e);
        return [];
      }
    }

    let finalArray = [];

    // 2. Ψάχνουμε τον πίνακα σε όλα τα πιθανά μονοπάτια που μας έδειξες:
    if (Array.isArray(parsedRes)) {
      finalArray = parsedRes;
    }
    // Για τα Products: payload -> data -> items
    else if (parsedRes.payload?.data?.items && Array.isArray(parsedRes.payload.data.items)) {
      finalArray = parsedRes.payload.data.items;
    }
    // Για τα Boxes & Statuses: payload -> data -> data (ΑΥΤΟ ΕΛΕΙΠΕ!)
    else if (parsedRes.payload?.data?.data && Array.isArray(parsedRes.payload.data.data)) {
      finalArray = parsedRes.payload.data.data;
    }
    // Άλλες εναλλακτικές περιπτώσεις για ασφάλεια
    else if (parsedRes.payload?.data && Array.isArray(parsedRes.payload.data)) {
      finalArray = parsedRes.payload.data;
    } else if (parsedRes.data?.data && Array.isArray(parsedRes.data.data)) {
      finalArray = parsedRes.data.data;
    } else if (parsedRes.data?.items && Array.isArray(parsedRes.data.items)) {
      finalArray = parsedRes.data.items;
    } else if (parsedRes.data && Array.isArray(parsedRes.data)) {
      finalArray = parsedRes.data;
    } else if (parsedRes.items && Array.isArray(parsedRes.items)) {
      finalArray = parsedRes.items;
    } else {
      console.warn(`Δεν βρέθηκε πίνακας στο response του ${nameForLog}:`, parsedRes);
    }

    console.log(`[Λίστα ${nameForLog}]: Βρέθηκαν ${finalArray.length} εγγραφές.`);
    return finalArray;
  }

  loadDonationData() {
    this.donationsService.getDonationById(this.donationId!).subscribe({
      next: (res: any) => {
        let data = res?.payload?.data || res?.data || res;
        if (Array.isArray(data)) data = data[0]; // Αν είναι σε πίνακα, πάρε το πρώτο

        if (!data) {
          this.isLoading = false;
          return;
        }

        // 1. Γέμισμα Items (Προϊόντων & Συσκευασιών)
        const itemsArray = this.donationForm.get('items') as FormArray;
        itemsArray.clear();

        if (data.items && Array.isArray(data.items)) {
          data.items.forEach((item: any) => {
            // SOS: Φτιάχνουμε σωστά το item για να γεμίσει η γραμμή
            this.addItem({
              product: item.product?._id || item.product,
              box: item.box?._id || item.box,
              size: item.size || '',
              expireData: item.expireData,
              note: item.note,
              boxObj: item.box // <-- ΑΥΤΟ ΤΟΠΟΘΕΤΕΙ ΤΙΣ ΔΙΑΣΤΑΣΕΙΣ ΣΤΟ HTML
            });
          });
        }

        // 2. Υπολογισμός αν υπάρχει Μεταφορέας
        const hasTransporter = !!(data.transporter?.name || data.transporter?.phone);

        // 3. Γέμισμα της υπόλοιπης φόρμας
        this.donationForm.patchValue({
          fullName: data.fullName,
          contactPerson: data.contactPerson,
          phone: data.phone,
          city: data.city,
          country: data.country || 'Greece',
          description: data.description,

          status: data.status?._id || data.status,

          transporter: {
            own: hasTransporter,
            name: data.transporter?.name || '',
            phone: data.transporter?.phone || ''
          },

          producerlocation: {
            locationName: data.producerlocation?.locationName || data.location?.locationName || '',
            contactName: data.producerlocation?.contactName || data.location?.contactName || '',
            contactPhone: data.producerlocation?.contactPhone || data.location?.contactPhone || '',
            country: data.producerlocation?.country || data.location?.country || 'Greece',
            city: data.producerlocation?.city || data.location?.city || '',
            zipCode: data.producerlocation?.zipCode || data.location?.zipCode || '',
            address: data.producerlocation?.address || data.location?.address || '',
            description: data.producerlocation?.description || data.location?.description || ''
          }
        });

        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Σφάλμα λήψης δωρεάς:', err);
        this.isLoading = false;
      }
    });
  }

  // --- ITEMS LOGIC ---
  get itemsControls() {
    if (!this.donationForm) return [];
    return (this.donationForm.get('items') as FormArray).controls;
  }

  addItem(data?: any) {
    const itemGroup = this.fb.group({
      product: [data?.product || '', Validators.required],
      box: [data?.box || '', Validators.required],
      size: [data?.size || '', Validators.required],
      expireData: [this.formatDate(data?.expireData) || '', Validators.required],
      note: [data?.note || ''],
      boxObj: [data?.boxObj || null]
    });
    (this.donationForm.get('items') as FormArray).push(itemGroup);
  }

  removeItem(index: number) {
    (this.donationForm.get('items') as FormArray).removeAt(index);
  }

  get isBasicInfoValid(): boolean {
    if (!this.donationForm) return false;
    const fields = ['fullName', 'contactPerson', 'phone', 'city'];
    return fields.every(field => this.donationForm.get(field)?.valid);
  }

  get isItemsValid(): boolean {
    if (!this.donationForm) return false;
    return this.donationForm.get('items')?.valid || false;
  }

  moveToNextTab() { if (this.selectedTabIndex < 3) this.selectedTabIndex++; }
  moveBackTab() { if (this.selectedTabIndex > 0) this.selectedTabIndex--; }

  onSubmit() {
    if (this.donationForm.invalid) {
      this.donationForm.markAllAsTouched();
      this.snackBar.open('Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία.', 'ΟΚ', { duration: 3000 });
      return;
    }

    this.isLoading = true;

    // ΠΑΙΡΝΟΥΜΕ ΕΝΑ ΑΝΤΙΓΡΑΦΟ ΓΙΑ ΝΑ ΤΟ ΚΑΘΑΡΙΣΟΥΜΕ
    const payload = JSON.parse(JSON.stringify(this.donationForm.getRawValue()));

    // Διαχείριση Transporter
    if (!payload.transporter.own) {
      payload.transporter = { name: null, phone: null };
    } else {
      delete payload.transporter.own;
    }

    // ==========================================
    // ΚΑΘΑΡΙΣΜΟΣ ΓΙΑ ΝΑ ΜΗ ΒΓΑΖΕΙ 422 TO API
    // ==========================================

    // 1. Το API δεν δέχεται 'description' μέσα στο producerlocation.
    // Οπότε διαγράφουμε ΜΟΝΟ το description, αφήνοντας τα υπόλοιπα (lat, lng, address κλπ).
    if (payload.producerlocation && payload.producerlocation.description !== undefined) {
      delete payload.producerlocation.description;
    }

    // 2. Το API δεν δέχεται το 'boxObj' μέσα στα items.
    if (payload.items && Array.isArray(payload.items)) {
      payload.items.forEach((item: any) => {
        delete item.boxObj;
      });
    }
    // ==========================================

    if (this.isEditMode) {
      this.donationsService.updateDonation(this.donationId!, payload).subscribe({
        next: () => this.handleSuccess(),
        error: (err) => {
          console.error('Update Error:', err);
          this.isLoading = false;
          this.snackBar.open('Σφάλμα κατά την ενημέρωση.', 'ΟΚ', { duration: 3000 });
        }
      });
    } else {
      this.donationsService.createDonation(payload).subscribe({
        next: () => this.handleSuccess(),
        error: (err) => {
          console.error('Create Error:', err);
          this.isLoading = false;
          this.snackBar.open('Σφάλμα κατά την αποθήκευση.', 'ΟΚ', { duration: 3000 });
        }
      });
    }
  }

  handleSuccess() {
    this.snackBar.open('Η Δωρεά αποθηκεύτηκε επιτυχώς!', 'ΟΚ', { duration: 3000 });
    this.router.navigate(['/producer/donations']);
  }

  private formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toISOString().split('T')[0];
  }
}
