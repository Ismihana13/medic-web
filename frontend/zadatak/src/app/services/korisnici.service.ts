import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, map, Observable, of, throwError} from 'rxjs';

import {MojConfig} from "../moj-config";


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${MojConfig.adresa_servera}`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users`);
  }
  getUserLastLogin(id: number): Observable<Date | null> {
    return this.http.get<Date | null>(`${this.apiUrl}/Autentifikacija/GetUserTime/${id}`);
  }

  updateUser(id: number, user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, user);
  }

  blockUser(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/block/${id}`, {});
  }
}
