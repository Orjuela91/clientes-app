import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { URL_BACKEND } from '../config/config';
import { AuthService } from '../usuarios/auth.service';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { ModalService } from './detalle/modal.service';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado: Cliente;
  urlBackend: string = URL_BACKEND;

  constructor(private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService,
    public authService: AuthService) { }

  ngOnInit(): void {
    
    this.activatedRoute.paramMap.subscribe( (params) => {
      let page: number = +params.get('page');

      if(!page){
        page = 0;
      }

      this.clienteService.getClientes(page).subscribe(
        /*(clientes) => {this.clientes = clientes},*/
        (response) => {
          this.clientes = response.content as Cliente[];
          this.paginador = response;
        },
        (err) => {console.error('Observer got an error: ', err)},
        () => {console.log('Observer got a complete notification')}
      );
    });
   /* 
    this.clienteService.getClientes().subscribe(
      (clientes) => {this.clientes = clientes},
      (err) => {console.error('Observer got an error: ', err)},
      () => {console.log('Observer got a complete notification')}
    );*/
  }

  delete(cliente: Cliente): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });
    
    swalWithBootstrapButtons.fire({
      title: '¿Esta seguro?',
      text: `¿Seguro que desea elimiar al cliente ${cliente.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id).subscribe(
          (response) => {
            this.clientes = this.clientes.filter( (cli) => { return cli != cliente});
            swalWithBootstrapButtons.fire(
              'Cliente Eliminado',
              `El cliente ${cliente.nombre} fue elminado con exito`,
              'success'
            );
          },
          (err) => {console.log('observable error', err)},
          () => {}
        );
      }
    });
  }

  abrirModal(cliente: Cliente): void {
    this.clienteSeleccionado = cliente;
  }

}
