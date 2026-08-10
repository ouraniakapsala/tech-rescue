import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatusesService {

  private baseUrl = `${environment.IP}/status`;

  constructor(private http: HttpClient) {}

  getAllStatuses(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }

  getStatusById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  createStatus(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, data);
  }

  updateStatus(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data);
  }

  deleteStatus(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  restoreStatus(id: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/restore/${id}`, {});
  }

  toggleStatusActivity(id: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/toggle/${id}`, {});
  }
}
