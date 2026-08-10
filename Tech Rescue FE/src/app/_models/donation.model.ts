// 1. Το Προϊόν που περιέχεται σε κάθε αντικείμενο δωρεάς
export interface Product {
  _id?: string;
  name: string;
}

// 2. Το συγκεκριμένο είδος μέσα στη δωρεά (π.χ. 5 πακέτα μακαρόνια)
export interface DonationItem {
  _id?: string;
  product: Product; // Εδώ είναι το nested object που σου χτύπαγε στο HTML
  size: string;
  expireData: string;
  note?: string;
  box?: string;
}

// 3. Στοιχεία τοποθεσίας (χρησιμοποιείται για Producer και Entity)
export interface LocationInfo {
  locationName: string;
  contactPhone: string;
  contactName: string;
  country: string;
  city: string;
  zipCode: string;
  address: string;
  lat?: string | number | null;
  lng?: string | number | null;
  description?: string;
}

// 4. Το κύριο μοντέλο της Δωρεάς (Donation)
export interface Donation {
  _id: string;
  producer: string;
  items: DonationItem[];
  fullName: string;      // Όνομα παραγωγού/επιχείρησης
  phone: string;
  city: string;
  country: string;
  description: string;
  contactPerson: string;
  status: any;           // Μπορείς να βάλεις string ή interface αν έχεις
  entity?: string;       // ID του φορέα που την αποδέχτηκε
  delete: boolean;
  createdAt: string;
  updatedAt: string;
  producerlocation?: LocationInfo;
  entitylocation?: LocationInfo;
  transporter?: any;
}

// 5. Το Payload που στέλνεις για την Αποδοχή (Accept Donation)
export interface AcceptDonationPayload {
  entitylocation: LocationInfo;
  transporter: any;
}

// 6. Το wrapper του API response (βάσει αυτού που έστειλες)
export interface ApiResponse<T> {
  payload: {
    message?: string;
    data: T;
    pages: number;
    total?: number; // Αν επιστρέφει συνολικό αριθμό
  };
}
