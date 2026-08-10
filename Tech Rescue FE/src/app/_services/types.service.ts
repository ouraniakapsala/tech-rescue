import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TypesService {

  private baseUrl = `${environment.IP}/item`;

  constructor(private http: HttpClient) {}

  getAllTypes(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }

  getTypeById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  createType(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, data);
  }

  updateType(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data);
  }

  deleteType(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  restoreType(id: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/restore/${id}`, {});
  }

  toggleTypeActivity(id: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/toggle/${id}`, {});
  }
}
