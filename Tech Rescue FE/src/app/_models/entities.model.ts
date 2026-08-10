export interface Transporter {
  name?: string;
  phone?: string;
  own?: boolean;
}

export interface EntityLocation {
  active?: boolean;
  main?: boolean;
  locationName: string;
  contactPhone?: string;
  contactName?: string;
  country?: string;
  city?: string;
  zipCode?: string;
  address?: string;
  lat?: number;
  lng?: number;
  description?: string;
}

export interface Entity {
  _id?: string; // Αν επιστρέφεται από τη βάση
  role?: string; // Πάντα 'entity'
  email: string;
  password?: string; // Συνήθως χρειάζεται μόνο στο create (registration)
  fullName: string;
  contactPerson?: string;
  phone?: string;
  city?: string;
  country?: string;
  zipCode?: string;
  description?: string;
  transporter?: Transporter;
  location?: EntityLocation[];
}
