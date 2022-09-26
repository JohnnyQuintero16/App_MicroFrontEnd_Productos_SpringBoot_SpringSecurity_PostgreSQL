import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  constructor(private rutaActiva: ActivatedRoute) { }

  user:string;
  ngOnInit(): void {
    this.rutaActiva.queryParams.subscribe(
      (params: Params) => {
        this.user = params['id'];
      }
    );
  }

    //=========== SEGURIDAD ==============
    //Aplicada en productos.guard y agregada en el routing



}
