import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { observable, Observable, of, throwError } from 'rxjs';
import { catchError, flatMap, map, mergeMap, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ClienteService } from '../clientes/cliente.service';
import { Factura } from './models/factura';
import { ItemFactura } from './models/item-factura';
import { Producto } from './models/producto';
import { FacturaService } from './services/factura.service';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {

  public titulo: string = 'Nueva Factura';
  public factura: Factura = new Factura();

  autocompleteControl = new FormControl();
  //productos: string[] = ['One', 'Two', 'Three'];
  //productosFiltrados: Observable<string[]>;
  productosFiltrados: Observable<Producto[]>;

  constructor(private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    private facturaService: FacturaService,
    private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(
      (params) => {
        let clienteId: number = +params.get('clienteId');
        this.clienteService.getCliente(clienteId).subscribe(
          (cliente) => {
            this.factura.cliente = cliente;
          },
          (err) => {
            console.error(err);
          },
          () => { }
        );
      },
      (err) => {
        console.error(err);
      },
      () => { }
    );
    /*
  this.productosFiltrados = this.autocompleteControl.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );*/
    this.productosFiltrados = this.autocompleteControl.valueChanges
      .pipe(
        map(value => typeof value === 'string' ? value : value.nombre),
        mergeMap(value => value ? this._filter(value) : [])
      );
  }

  /*
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.productos.filter(option => option.toLowerCase().includes(filterValue));
  }*/

  private _filter(value: string): Observable<Producto[]> {

    return this.facturaService.filtrarProductos(value);
  }

  public mostrarNombre(producto?: Producto): string | undefined {
    return producto ? producto.nombre : undefined;
  }

  public seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
    let producto: Producto = event.option.value as Producto;

    if (this.existeItem(producto.id)) {
      this.incrementaCantidad(producto.id);
    } else {
      let nuevoItem: ItemFactura = new ItemFactura();

      nuevoItem.producto = producto;

      this.factura.items.push(nuevoItem);
    }

    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();

  }

  public actualizarCantidad(id: number, event: any): void {
    let cantidad: number = event.target.value as number;

    if(cantidad == 0){
      return this.eliminarItemFactura(id);
    }

    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if (id == item.producto.id) {
        item.cantidad = cantidad;
      }

      return item;
    });
  }

  public existeItem(id: number): boolean {
    let existe: boolean = false;
    this.factura.items.forEach((item: ItemFactura) => {
      if (id == item.producto.id) {
        existe = true;
      }
    });

    return existe;
  }

  public incrementaCantidad(id: number): void {
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if (id == item.producto.id) {
        ++item.cantidad;
      }

      return item;
    });
  }

  public eliminarItemFactura(id: number): void{
    this.factura.items = this.factura.items.filter((item: ItemFactura) => {
      return id != item.producto.id;
    });
  }

  public create(): void{
    this.facturaService.create(this.factura).subscribe(
      (factura) => {
        Swal.fire(
          this.titulo,
          'Factura ' + factura.descripcion + ' creada con exito',
          'success'
        );
        this.router.navigate(['/facturas', factura.id]);
      },
      (err) => {console.error(err)},
      () => {}
    );
  }

  test(): boolean{
    return false;
  }

}
