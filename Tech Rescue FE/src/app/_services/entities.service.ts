import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Διόρθωσε το path

@Injectable({
  providedIn: 'root'
})
export class EntitiesService {

  private apiUrl = `${environment.IP}`;

  constructor(private http: HttpClient) { }

  // 1. Λήψη όλων των Entities
  getAllEntities(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users?role=entity`);
  }

  // 2. Λήψη ενός Entity βάσει ID
  getEntityById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`);
  }

  // 3. Εγγραφή Νέου Entity (Μένει ίδιο - παίρνει όλο το payload)
  createEntity(entityData: any): Observable<any> {
    const payload = { ...entityData, role: 'entity' };
    return this.http.post<any>(`${this.apiUrl}/users/register`, payload);
  }

  // 4. Ενημέρωση ΒΑΣΙΚΩΝ στοιχείων Entity (Πιθανότατα χωρίς το location array πλέον)
  updateEntity(id: string, entityData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${id}`, entityData);
  }

  // 5. Διαγραφή (Soft Delete) Entity
  deleteEntity(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${id}`);
  }

  // 6. Ενεργοποίηση / Απενεργοποίηση User
  toggleUserActive(id: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/users/toggle/${id}`, {});
  }

  restoreEntity(id: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/users/restore/${id}`, {});
  }

  // Στο entities.service.ts
  updateTransporter(userId: string, transporterData: any): Observable<any> {
    // Δοκίμασε αυτή τη διαδρομή που είναι η πιο πιθανή βάσει του location pattern
    return this.http.put<any>(`${this.apiUrl}/users/profile/transporter/${userId}`, transporterData);
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    const payload = {
      oldPassword: oldPassword,
      newPassword: newPassword
    };

    return this.http.post<any>(`${this.apiUrl}/users/changepassword`, payload);
  }
  // ==========================================
  // --- ΝΕΑ ENDPOINTS ΓΙΑ ΤΙΣ ΤΟΠΟΘΕΣΙΕΣ ---
  // ==========================================


  // Πήρε το userId ως πρώτη παράμετρο
  addLocation(userId: string, locationData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/profile/location/${userId}`, locationData);
  }

  // Ενημέρωση υπάρχουσας τοποθεσίας
  updateLocation(locationId: string, locationData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/profile/location/${locationId}`, locationData);
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
}
