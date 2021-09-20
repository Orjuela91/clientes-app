import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
//import { listClientes } from './clientes.json'; //archivo local
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';
import { Region } from './region';
import { AuthService } from '../usuarios/auth.service';
import { URL_BACKEND } from '../config/config';


@Injectable()
export class ClienteService {

  // local
  //private urlEndPoint: string = "http://localhost:8080/api/clientes";
  //private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  //heroku
  private urlEndPoint: string = URL_BACKEND + "/api/clientes";
  constructor(private http: HttpClient,
    private route: Router,
    private authService: AuthService) { }

/*
  getClientes(): Observable<Cliente[]> { 
    //return of(listClientes); //archivo local json

    return this.http.get(this.urlEndPoint).pipe(
      map( (response) => {
        let clientes = response as Cliente[];

        return clientes.map( (cliente) => {
          cliente.nombre = cliente.nombre.toUpperCase();
          cliente.createAt = formatDate(cliente.createAt, 'dd/MM/yyyy', 'en-US');
          return cliente;
        });
      }),
    );
  }
*/

/* // agregar token a las cabeceras de forma manual
  private agregarAuthorizationHeader(): HttpHeaders{
    let token = this.authService.token;

    if(token != null){
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }

    return this.httpHeaders;
  }*/

  /* // manejo de erroes de forma manual
  private isNoAutorizado(error: any): boolean {

    //no esta autorizado o el token expiro en el backend
    if(error.status == 401){

      if(this.authService.isAuthenticated()){
        this.authService.logout(); 
      }

      this.route.navigate(['/login']);
      return true;
    }

    if(error.status == 403){
      Swal.fire(
        'Acceso denegado',
        'Holaa ' + this.authService.usuario.username + ' no tienes acceso a este recurso',
        'warning'
      );

      this.route.navigate(['/clientes']);
      return true;
    }

    return false;
  }*/

  getRegiones(): Observable<Region[]>{
    return this.http.get<Region[]>(this.urlEndPoint + '/regiones').pipe(
      catchError( (error) => {
        return throwError(error);
      })
    );
  }

  getClientes(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      map( (response: any) => {
          (response.content as Cliente[]).map( (cliente) => {
            cliente.nombre = cliente.nombre.toUpperCase();
            return cliente;
          });

          return response;
      }),
    );
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.urlEndPoint, cliente).pipe(
      map( (response: any) => { return response.cliente as Cliente}),
      catchError( (err) => {
        Swal.fire(
          'Error al crear cliente',
          err.error.mensaje,
          'error'
        );
        return throwError(err);
      }),
    );
  }

  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(this.urlEndPoint+'/'+id).pipe(
      catchError( (err) => {
        Swal.fire('Error al editar', err.error.mensaje);
        return throwError(err);
      }),
    );
  }

  update(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(this.urlEndPoint+'/'+cliente.id, cliente).pipe(
      map( (response: any) => { return response.cliente as Cliente}),
      catchError( (err) => {
        Swal.fire(
          'Error al editar cliente',
          err.error.mensaje,
          'error'
        );
        return throwError(err);
      }),
    );
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(this.urlEndPoint+'/'+id).pipe(
      catchError( (err) => {

        Swal.fire(
          'Error al eliminar cliente',
          err.error.mensaje,
          'error'
        );
        return throwError(err);
      }),
    );
  }

  subirFoto(archivo: File, id: number): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id.toString());

    const req = new HttpRequest('POST', this.urlEndPoint+'/upload', formData, {
      reportProgress: true,
    }

    );

    return this.http.request(req).pipe(
      catchError( (error) => {
        return throwError(error);
      })
    );
    ;
  }
}
