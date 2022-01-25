import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public titulo: string = "Crear Cliente";
  public cliente: Cliente = new Cliente();

  public errors: string[];

  constructor( private clienteService: ClienteService,
               private router: Router,
               private activatedRoute: ActivatedRoute ) { }

  ngOnInit(): void {
    this.cargarCliente();
  }

  cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if(id) {
        this.clienteService.getCliente(id).subscribe( (cliente) => this.cliente = cliente );
      }
    })
  }

  public create (): void {
    this.clienteService.create(this.cliente).subscribe(
      cliente => { 
        this.router.navigate(['/clientes']);
        //Librería importada de sweetalert2. Da mensajes de error más visuales 
        Swal.fire( 'Nuevo Cliente', `El cliente ${cliente.nombre} ha sido creado con éxito!`, 'success' );
      },
      err => {
        this.errors = err.error.errors as string[];
        console.error(err.error.errors);
        
      });
  }

  public update(): void {
    this.clienteService.update(this.cliente).subscribe( json => {
      this.router.navigate(['/clientes']);
      Swal.fire( 'Cliente Actualizado', `${json.mensaje}: ${json.cliente.nombre}`, 'success' );
    },
    err => {
      this.errors = err.error.errors as string[];
      console.error(err.error.errors);
      
    });
  }

}
