import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sample, SampleResponse, CreateSamplePayload } from '../models/sample.model';
import { CAP_CONFIG } from '../config/credentials';

@Injectable({
  providedIn: 'root'
})
export class SampleService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = CAP_CONFIG.baseUrl;

  getSamples(): Observable<SampleResponse> {
    return this.http.get<SampleResponse>(this.baseUrl);
  }

  getSampleById(id: string): Observable<Sample> {
    return this.http.get<Sample>(`${this.baseUrl}/${id}`);
  }

  createSample(sample: CreateSamplePayload): Observable<Sample> {
    return this.http.post<Sample>(this.baseUrl, sample);
  }

  updateSample(id: string, sample: CreateSamplePayload): Observable<Sample> {
    return this.http.patch<Sample>(`${this.baseUrl}/${id}`, sample);
  }

  deleteSample(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
