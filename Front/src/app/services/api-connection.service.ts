// Front/src/app/services/api-connection.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface InfoDto {
  sensor: 'TEMP' | 'HUM';
  value: number;
  date: string;
  count?: number;   // solo si usas aggregate=avg1m
}

@Injectable({ providedIn: 'root' })
export class ApiConnectionService {
  private baseUrl = 'http://localhost:4000/api';

  constructor(private http: HttpClient) {}

  getDatos$(): Observable<InfoDto[]> {
    return this.http.get<InfoDto[]>(`${this.baseUrl}/info`);
  }

  setDatos$(sensor: 'TEMP' | 'HUM', value: number, date?: string): Observable<InfoDto> {
    const body: any = { sensor, value };
    if (date) body.date = date;               // <- ahora sí envía el valor recibido
    return this.http.post<InfoDto>(`${this.baseUrl}/info`, body);
  }


  getUltimosMin$(minutes: number, limit = 1000): Observable<InfoDto[]> {
    const params = new HttpParams()
      .set('minutes', String(minutes))
      .set('limit', String(limit));
    return this.http.get<InfoDto[]>(`${this.baseUrl}/info`, { params });
  }

  /** Rango por sensor con paginación */
  getRango$(
    sensor: 'TEMP' | 'HUM',
    fromIso: string,
    toIso: string,
    limit = 1000,
    skip = 0
  ): Observable<InfoDto[]> {
    const params = new HttpParams()
      .set('sensor', sensor)
      .set('from', fromIso)
      .set('to', toIso)
      .set('limit', String(limit))
      .set('skip', String(skip));
    return this.http.get<InfoDto[]>(`${this.baseUrl}/info`, { params });
  }

  getAvgPorMin$(sensor: 'TEMP' | 'HUM', minutes = 60): Observable<InfoDto[]> {
    const params = new HttpParams()
      .set('sensor', sensor)
      .set('minutes', String(minutes))
      .set('aggregate', 'avg1m');
    return this.http.get<InfoDto[]>(`${this.baseUrl}/info`, { params });
  }
}
