import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';

@Injectable()
export class ErrorsInterceptor implements HttpInterceptor {

  constructor(private router: Router,
    private authService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error) => {
        //no esta autorizado o el token expiro en el backend
        if (error.status == 401) {

          if (this.authService.isAuthenticated()) {
            this.authService.logout();
          }

          this.router.navigate(['/login']);

        }

        if (error.status == 403) {
          Swal.fire(
            'Acceso denegado',
            'Holaa ' + this.authService.usuario.username + ' no tienes acceso a este recurso',
            'warning'
          );

          this.router.navigate(['/clientes']);

        }
        return throwError(error);
      }),
    );
  }
}
