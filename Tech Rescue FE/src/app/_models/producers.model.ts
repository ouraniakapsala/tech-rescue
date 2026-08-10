export interface ProducerLocation {
  active: boolean;
  main: boolean;
  locationName: string;
  contactName?: string;
  contactPhone?: string;
  country: string;
  city: string;
  zipCode: string;
  address: string;
  lat?: number;
  lng?: number;
  description?: string;
}

export interface ProducerTransporter {
  own: boolean;
  name?: string;  // Required if 'own' is true
  phone?: string; // Required if 'own' is true
}

export interface Producer {
  _id?: string; // Optional (not present when creating new)
  role: 'producer';

  // Basic Info
  fullName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  password?: string; // Only used when creating/updating

  // Company Address (Main HQ)
  country: string;
  city: string;
  zipCode: string;
  description?: string;

  // Complex Objects
  transporter?: ProducerTransporter;
  location?: ProducerLocation[];

  // System fields
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
