import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from './modal.service';

import $ from "jquery";
import { FacturaService } from 'src/app/facturas/services/factura.service';
import { Factura } from 'src/app/facturas/models/factura';
import { AuthService } from 'src/app/usuarios/auth.service';
import { URL_BACKEND } from 'src/app/config/config';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente: Cliente;
  titulo: string = "Detalle del cliente";

  private fotoSeleccionanda: File;
  progreso: number = 0;
  urlBackend: string = URL_BACKEND;

  constructor(private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    public modalService: ModalService,
    private facturaService: FacturaService,
    public authService: AuthService) { }

  ngOnInit(): void {
    /*
    this.activatedRoute.paramMap.subscribe(
      (params) => {
        let id: number = +params.get('id');
        if(id){
          this.clienteService.getCliente(id).subscribe(
            (cliente) => { this.cliente = cliente},
            (err) => {console.error('Observer got an error: ', err)},
            () => console.log('Observer got a complete notification')
          );
        }
      },
      (err) => {console.error('Observer got an error: ', err)},
      () => console.log('Observer got a complete notification')
    );*/
  }

  seleccionarFoto(event: any): void {
    this.fotoSeleccionanda = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionanda);
    if(this.fotoSeleccionanda.type.indexOf('image') < 0){
      Swal.fire(
        'Error seleccionar imagen:', 
        'El archivo debe ser una imagen', 
        'error'
      );

      this.fotoSeleccionanda = null;
    
    }
  }

  subirFoto(): void{

    if(!this.fotoSeleccionanda){
      Swal.fire('Error: debe seleccionar una foto', '', 'error');
    }else{
      this.clienteService.subirFoto(this.fotoSeleccionanda, this.cliente.id).subscribe(
        (event) => {
          //this.cliente = cliente;
          if(event.type === HttpEventType.UploadProgress){
            this.progreso = Math.round((event.loaded/event.total)*100);
          }else if(event.type === HttpEventType.Response){
            let response: any = event.body;
            this.cliente = response.cliente as Cliente;
            Swal.fire(
              'La foto se ha subido completamente!',
              'la foto se ha subido con exito: ' + this.cliente.foto,
              'success'
            );
          }
        },
        (err) => {console.error('Observer got an error: ', err)},
        () => console.log('Observer got a complete notification')
      );
    }
  }

  cerrarModal(): void {
    $('#btn_close_modal').click();
    this.fotoSeleccionanda = null;
    this.progreso = 0;
  }

  public delete(factura: Factura): void{
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });
    
    swalWithBootstrapButtons.fire({
      title: '¿Esta seguro?',
      text: `¿Seguro que desea elimiar la factura: ${factura.descripcion}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.facturaService.delete(factura.id).subscribe(
          (response) => {
            this.cliente.facturas = this.cliente.facturas.filter( (fact) => { return fact != factura});
            swalWithBootstrapButtons.fire(
              'Factura Eliminada',
              `La factura ${factura.descripcion} fue elminada con exito`,
              'success'
            );
          },
          (err) => {console.log('observable error', err)},
          () => {}
        );
      }
    });
  }

}
