import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = 'http://localhost:5000/api';
  constructor(private http: HttpClient){}

  apply(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/apply`, data);
  }

  getStatus(aadhar: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/status/${aadhar}`);
  }

  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/applications`);
  }

  update(id: string, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/applications/${id}`, payload);
  }

}
