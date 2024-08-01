// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user';


@Injectable({
    providedIn: 'root'
})
export class UserService {
    private BASE_URL = environment.BASE_URL;
    private tokenKey = environment.tokenKey;

    constructor(private http: HttpClient) {}

    login(username: string, password: string): Observable<any> {
        return this.http.post(`${this.BASE_URL}/login`, { username, password });
    }

    register(username: string, passwordHash: string, firstName: string, lastName: string, email: string): Observable<any> {
        return this.http.post(`${this.BASE_URL}/register`, { 
          username, 
          passwordHash, 
          firstName, 
          lastName, 
          email, 
        });
      }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
    }

    setToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    isAuthenticated(): boolean {
        return this.getToken() !== null;
    }

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.BASE_URL}/users`);
    }

}