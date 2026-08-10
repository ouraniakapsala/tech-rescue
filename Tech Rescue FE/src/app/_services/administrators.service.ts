import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Διόρθωσε το path αν χρειάζεται

@Injectable({
  providedIn: 'root'
})
export class AdministratorsService {

  private apiUrl = `${environment.IP}`;

  constructor(private http: HttpClient) { }

  // 1. Λήψη όλων των Administrators
  getAllAdministrators(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users?role=admin`);
  }

  // 2. Λήψη ενός Administrator βάσει ID
  getAdministratorById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`);
  }

  // 3. Εγγραφή Νέου Administrator
  createAdministrator(adminData: any): Observable<any> {
    // Εδώ "καρφώνουμε" τον ρόλο του admin
    const payload = { ...adminData, role: 'admin' };
    return this.http.post<any>(`${this.apiUrl}/users/register`, payload);
  }

  // 4. Ενημέρωση ΒΑΣΙΚΩΝ στοιχείων Administrator
  updateAdministrator(id: string, adminData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${id}`, adminData);
  }

  // 5. Διαγραφή (Soft Delete) Administrator
  deleteAdministrator(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${id}`);
  }

  // 6. Ενεργοποίηση / Απενεργοποίηση User
  toggleAdministratorActive(id: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/users/toggle/${id}`, {});
  }

  // 7. Επαναφορά διεγραμμένου Administrator
  restoreAdministrator(id: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/users/restore/${id}`, {});
  }

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
  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    const payload = {
      oldPassword: oldPassword,
      newPassword: newPassword
    };
    return this.http.post<any>(`${this.apiUrl}/users/changepassword`, payload);
  }
}
