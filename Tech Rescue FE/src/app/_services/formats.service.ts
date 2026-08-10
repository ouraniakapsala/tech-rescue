import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormatsService {

  // Based on your payload, the endpoint seems to be '/box'
  private baseUrl = `${environment.IP}/box`;

  constructor(private http: HttpClient) {}

  // GET all items
  getAllFormats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }

  // GET by ID
  getFormatById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // CREATE
  createFormat(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, data);
  }

  // UPDATE
  updateFormat(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data);
  }

  // DELETE (Soft delete)
  deleteFormat(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  // RESTORE
  restoreFormat(id: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/restore/${id}`, {});
  }

  // TOGGLE ACTIVITY
  toggleFormatStatus(id: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/toggle/${id}`, {});
  }
}
