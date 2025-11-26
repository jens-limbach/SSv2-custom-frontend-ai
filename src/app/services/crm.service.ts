import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  Opportunity,
  Account,
  Product,
  Employee,
  ServiceCase,
  CrmEntitiesResponse
} from '../models/crm-entities.model';
import { CRM_CONFIG } from '../config/credentials';

@Injectable({
  providedIn: 'root'
})
export class CrmService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = CRM_CONFIG.baseUrl;
  
  // Credentials loaded from separate file (not committed to git)
  private readonly credentials = btoa(`${CRM_CONFIG.username}:${CRM_CONFIG.password}`);

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Basic ${this.credentials}`,
      'Content-Type': 'application/json'
    });
  }

  getOpportunities(): Observable<Opportunity[]> {
    return this.http.get<CrmEntitiesResponse<Opportunity>>(
      `${this.baseUrl}/sap/c4c/api/v1/opportunity-service/opportunities?$top=200`,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => response.value),
      catchError(error => {
        console.error('Error loading opportunities:', error);
        return of([]);
      })
    );
  }

  getAccounts(): Observable<Account[]> {
    return this.http.get<CrmEntitiesResponse<Account>>(
      `${this.baseUrl}/sap/c4c/api/v1/account-service/accounts?$top=200`,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => response.value),
      catchError(error => {
        console.error('Error loading accounts:', error);
        return of([]);
      })
    );
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<CrmEntitiesResponse<Product>>(
      `${this.baseUrl}/sap/c4c/api/v1/product-service/products?$top=200`,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => response.value),
      catchError(error => {
        console.error('Error loading products:', error);
        return of([]);
      })
    );
  }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<CrmEntitiesResponse<Employee>>(
      `${this.baseUrl}/sap/c4c/api/v1/employee-service/employees?$top=200`,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => response.value),
      catchError(error => {
        console.error('Error loading employees:', error);
        return of([]);
      })
    );
  }

  getServiceCases(): Observable<ServiceCase[]> {
    return this.http.get<CrmEntitiesResponse<ServiceCase>>(
      `${this.baseUrl}/sap/c4c/api/v1/case-service/cases?$top=200`,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => response.value),
      catchError(error => {
        console.error('Error loading service cases:', error);
        return of([]);
      })
    );
  }

  getAccountById(id: string): Observable<Account | null> {
    return this.http.get<Account>(
      `${this.baseUrl}/sap/c4c/api/v1/account-service/accounts/${id}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error loading account:', error);
        return of(null);
      })
    );
  }

  getOpportunityById(id: string): Observable<any | null> {
    return this.http.get<any>(
      `${this.baseUrl}/sap/c4c/api/v1/opportunity-service/opportunities/${id}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error loading opportunity:', error);
        return of(null);
      })
    );
  }
}
