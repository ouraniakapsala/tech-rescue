import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// Προσοχή στο path, βεβαιώσου ότι είναι το σωστό για το δικό σου project
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProducersService {

  private apiUrl = `${environment.IP}`;

  constructor(private http: HttpClient) {}

  // 1. Λήψη όλων των Producers
  getAllProducers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users?role=producer`);
  }

  // 2. Λήψη ενός Producer βάσει ID
  getProducerById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`);
  }

  // 3. Εγγραφή Νέου Producer
  createProducer(producerData: any): Observable<any> {
    // Καρφώνουμε το role σε producer πριν φύγει το request
    const payload = { ...producerData, role: 'producer' };
    return this.http.post<any>(`${this.apiUrl}/users/register`, payload);
  }

  // 4. Ενημέρωση ΒΑΣΙΚΩΝ στοιχείων Producer (ΠΛΕΟΝ ΕΙΝΑΙ ΠΡΑΓΜΑΤΙΚΟ API CALL)
  updateProducer(id: string, producerData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${id}`, producerData);
  }

  // 5. Διαγραφή (Soft Delete) Producer (ΠΛΕΟΝ ΕΙΝΑΙ ΠΡΑΓΜΑΤΙΚΟ API CALL)
  deleteProducer(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${id}`);
  }

  // 6. Ενεργοποίηση / Απενεργοποίηση Producer
  toggleProducerActive(id: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/users/toggle/${id}`, {});
  }

  // 7. Επαναφορά διεγραμμένου Producer
  restoreProducer(id: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/users/restore/${id}`, {});
  }

  // Ενημέρωση Μεταφορέα
  updateTransporter(userId: string, transporterData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/profile/transporter/${userId}`, transporterData);
  }
  // ==========================================
  // --- ENDPOINTS ΓΙΑ ΤΙΣ ΤΟΠΟΘΕΣΙΕΣ ---
  // ==========================================

  // Προσθήκη νέας τοποθεσίας
  addLocation(userId: string, locationData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/profile/location/${userId}`, locationData);
  }


  updateLocation(locationId: string, locationData: any): Observable<any> {
    const url = `${this.apiUrl}/users/profile/location/${locationId}`;
    return this.http.put<any>(url, locationData);
  }

  // Διαγραφή τοποθεσίας
  deleteLocation(locationId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/profile/location/${locationId}`);
  }

  // Επαναφορά διεγραμμένης τοποθεσίας
  restoreLocation(locationId: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/users/profile/location/restore/${locationId}`, {});
  }

  // Toggle Active/Inactive Τοποθεσίας
  toggleLocationActive(locationId: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/users/profile/location/toggle/${locationId}`, {});
  }


  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    const payload = {
      oldPassword: oldPassword,
      newPassword: newPassword
    };

    return this.http.post<any>(`${this.apiUrl}/users/changepassword`, payload);
  }
  // ==========================================
  // --- ENDPOINTS ΓΙΑ ΤΑ ΠΡΟΪΟΝΤΑ ΤΟΥ ΧΡΗΣΤΗ ---
  // ==========================================

  getAllItems(): Observable<any> {
    // Βάζουμε ένα μεγάλο limit για να έρθουν όλα σε μία σελίδα στο dropdown
    return this.http.get<any>(`${this.apiUrl}/item?page=1&limit=1000`);
  }

  updateUserProducts(userId: string, payload: { products: string[] }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/profile/products/${userId}`, payload);
  }

}


