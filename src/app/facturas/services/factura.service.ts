import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { URL_BACKEND } from 'src/app/config/config';
import { Factura } from '../models/factura';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  //local
  //private urlEndpoint: string = "http://localhost:8080/api/facturas";

  //heroku
  private urlEndpoint: string = URL_BACKEND + "/api/facturas";
  constructor(private http: HttpClient) { }

  public getFactura(id: number): Observable<Factura>{
    return this.http.get<Factura>(this.urlEndpoint+'/'+id).pipe(
      catchError( (err) => {
        return throwError(err);
      }),
    );
  }

  public delete(id: number): Observable<void>{
    return this.http.delete<void>(this.urlEndpoint+'/'+id).pipe(
      catchError( (err) => {
        return throwError(err);
      }),
    );
  }

  public filtrarProductos(term: string): Observable<Producto[]>{
    return this.http.get<Producto[]>(this.urlEndpoint+'/filtrar-productos/'+term).pipe(
      catchError( (err) => {
        return throwError(err);
      }),
    );
  }

  public create(factura: Factura): Observable<Factura>{
    return this.http.post<Factura>(this.urlEndpoint, factura).pipe(
      map( (response: any) => {
        return response.factura as Factura
      }),
      catchError( (err) => {
        return throwError(err);
      }),
    );
  }
}
