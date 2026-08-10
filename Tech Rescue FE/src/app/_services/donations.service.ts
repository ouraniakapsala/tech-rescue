import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DonationsService {
  private apiUrl = `${environment.IP}/donation`;

  constructor(private http: HttpClient) { }

  // Λήψη όλων των δωρεών με pagination
  getAllDonations(page: number = 1): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}`);
  }

  // Λήψη μιας δωρεάς βάσει ID
  getDonationById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Δημιουργία νέας δωρεάς
  createDonation(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  // Ενημέρωση δωρεάς
  updateDonation(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  // Αποδοχή δωρεάς από Φορέα (Accept Donation)
  acceptDonation(id: string, data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, data);
  }

  // Διαγραφή δωρεάς
  deleteDonation(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  restoreDonation(id: string, data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/restore/${id}`, data);
  }

  cancelDonation(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/cancel/${id}`);
  }
}
