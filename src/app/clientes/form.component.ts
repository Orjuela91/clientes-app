import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';

import Swal from 'sweetalert2';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  public titulo: string = "Crear cliente";
  public cliente: Cliente = new Cliente();
  regiones: Region[];

  private errores: string[];

  constructor(private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();

    this.clienteService.getRegiones().subscribe(
      (regiones) => {
        this.regiones = regiones;
      },
    );
  }

  cargarCliente(): void {
    this.activatedRoute.params.subscribe(
      (params) => {
        let id = params['id'];

        if(id){
          this.clienteService.getCliente(id).subscribe(
            (cliente) => {this.cliente = cliente},
            (err) => {console.error('Observer got an error: ', err)},
            () => {}
          );
        }
      },
      (err) => {console.error('Observer got an error: ', err)},
      () => {console.log('Observer got a complete notification')});
  }

  public create(): void {
    this.clienteService.create(this.cliente).subscribe(
      (cliente) => { 
        this.router.navigate(['/clientes']);
        Swal.fire({
          title: 'Nuevo Cliente!',
          text: `Cliente creado ${cliente.nombre}`,
          icon: 'success',
        })
      },
      (err) => {console.error('Observer got an error: ', err)},
      () => {console.log('Observer got a complete notification')}
    );
  }

  update(): void {
    this.clienteService.update(this.cliente).subscribe(
      (cliente) => {
        this.router.navigate(['/clientes']);
        Swal.fire({
          title: 'Cliente Actualizado',
          text: `Cliente actualizado ${cliente.nombre}` ,
          icon: 'success',
        })
      },
      (err) => {console.error('Observer got an error: ', err)},
      () => {}
    );
  }

  compararRegion(region1: Region, region2: Region): boolean {
    if(region1 === undefined && region2 === undefined){
      return true;
    }
    return region1 == null || region2 == null ? false : region1.id === region2.id;
  }
}
