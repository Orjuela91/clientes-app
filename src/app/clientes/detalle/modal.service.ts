import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ModalService {

  modal: boolean = false;

  constructor() { }

  toggleModal(): void{
    this.modal = !this.modal;
  }
}
