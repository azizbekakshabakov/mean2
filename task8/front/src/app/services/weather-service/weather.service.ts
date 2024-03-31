import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private tasksUrl = "http://localhost:3000/api";
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  };

  constructor(
    private http: HttpClient) { }

    getCity(city: any): Observable<any> {
      const cityObservable = this.http.get(this.tasksUrl + '/' + city)
        .pipe(
          map((response: any) => response['data'])
        );
      return cityObservable;
    }
}
