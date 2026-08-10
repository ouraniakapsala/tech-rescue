import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {

  private baseUrl = environment.IP;

  constructor(private http: HttpClient) {}

  // GET all categories
  getAllCategories(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/category`);
  }

  // GET a category by ID
  getCategoryById(categoryID: string | number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/category/${categoryID}`);
  }

  // POST a new category
  createCategory(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/category`, data);
  }

  // PUT / Edit category
  editCategory(categoryID: string | number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/category/${categoryID}`, data);
  }

  // DELETE category
  deleteCategory(id: string) {
    return this.http.delete(`${this.baseUrl}/category/${id}`);
  }

  // Optional: Restore category if your API supports it
  restoreCategory(categoryID: string | number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/category/restore/${categoryID}`, {});
  }

  toggleCategory(categoryID: string | number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/category/toggle/${categoryID}`, {});
  }
}
