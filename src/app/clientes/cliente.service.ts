import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DatePipe, formatDate } from '@angular/common';

import { Cliente } from './cliente';
import { CLIENTES } from './clientes.json';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor( private http: HttpClient,
               private router: Router ) { }

  getClientes(): Observable<Cliente[]> {
    //return of(CLIENTES);

    //Cualquiera de la dos formas es válida
    //return this.http.get<Cliente[]>(this.urlEndPoint);
    return this.http.get(this.urlEndPoint).pipe(
      tap( response => {
        let clientes = response as Cliente[];
        console.log('Cliente Service: tap 1');
        clientes.forEach( cliente => {
          console.log(cliente.nombre);
        })
      }),
      map( (response) => {
        let clientes = response as Cliente[];
    
        return clientes.map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();

          //cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US');

          //Otra forma de hacer lo anterior
          //let datePipe = new DatePipe('es');
          //cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy');

          return cliente;
        });
      }),
      tap( response => {
        console.log('Cliente Service: tap 2');
        response.forEach( cliente => {
          console.log(cliente.nombre)
        })
      }),
    );
  }

  getCliente(id:number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      //Control de los errores devueltos por el backend
      catchError( e => {
        this.router.navigate(['/clientes']);
        Swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }
  
  //En los métodos create y update se utilizan dos formas de controlar lo recibido para poder acceder correctamente a los 
  //atributos del cliente
  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      map( (response: any) => response.cliente as Cliente),
      //Control de los errores devueltos por el backend
      catchError( e => {

        //Control de los errores de validación del backend. Se tienen que controlar ya que estos errores los enviamos en el atributo errors
        if(e.status == 400) {
          return throwError(e);
        }

        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      //Control de los errores devueltos por el backend
      catchError( e => {

        if(e.status == 400) {
          return throwError(e);
        }

        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      //Control de los errores devueltos por el backend
      catchError( e => {
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
  
}
