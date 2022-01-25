import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];

  constructor( private clienteService: ClienteService ) { }

  ngOnInit(): void {
    this.clienteService.getClientes().pipe(
      tap(clientes => {
        console.log('Clientes Component: tap 3');
        clientes.forEach( cliente => {
          console.log(cliente.nombre);
        })
      })
    ).subscribe(
      clientes => this.clientes = clientes
    );
  }

  delete(cliente: Cliente): void {

    //Mensaje copidado directamente de la librería sweetalert2
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success mr-3',
        cancelButton: 'btn btn-danger mr-3'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: '¿Está seguro?',
      text: `¿Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '¡Si, eliminar!',
      cancelButtonText: '¡No, cancelar!',
      reverseButtons: true

    }).then((result) => {
      if (result.isConfirmed) {
        //Incluimos la llamada a nuestro servicio para filtrar el cliente borrado
        this.clienteService.delete(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes.filter(cli => cli !== cliente);
            swalWithBootstrapButtons.fire('¡Cliente Eliminado!', `El cliente ${cliente.nombre} a sido eliminado.`, 'success' );
          })
      }
    })
  }

}
