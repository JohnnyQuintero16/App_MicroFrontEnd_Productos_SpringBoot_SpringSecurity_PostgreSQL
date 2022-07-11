import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductoDto } from 'src/app/models/ProductoDto';
import { ProductoService } from 'src/app/services/producto/producto.service';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-lista-productos',
  templateUrl: './lista-productos.component.html',
  styleUrls: ['./lista-productos.component.scss']
})
export class ListaProductosComponent implements OnInit {

  navigationExtras : NavigationExtras = {

    state : {
      value :null
    }
};

  productos: ProductoDto[] = [];
  roles: string[]=[];
  isAdmin = false;

   //Paginado
   nroPagina=0;
   nroElementos=10;
   orderBy='id';
   direction='asc';

   firstPage=false;
   lastPage=false;

   //filtro:string=null;

  constructor(
    private router: Router,
    private productoService:ProductoService,
    private tokenService:TokenService,
    private toast: NgToastService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(){

    this.listarProductos();
    this.roles = this.tokenService.getAuthorities();
    this.roles.forEach(
      rol=>{
        if(rol=='ROLE_ADMIN'){
          this.isAdmin=true;
        }
      });


  }

  //=========== METODOS CRUD ==============


listarProductos(){
  this.productoService.listado(this.nroPagina,this.nroElementos,this.orderBy,this.direction).subscribe(
    (data:any)=>{
      this.productos = data.content;
      this.firstPage = data.first;
      this.lastPage = data.last;

      console.log(this.productos);
    },
    err => {
      console.log(err);
    }
  );
}


listarProductosFilter(){
  this.productoService.listadoFilter(this.nroPagina,this.nroElementos,this.orderBy,this.direction).subscribe(
    (data:any)=>{
      this.productos = data.content;
      this.firstPage = data.first;
      this.lastPage = data.last;

      console.log(this.productos);
    },
    err => {
      console.log(err);
    }
  );
}

  // Editar Productos
  editarProducto(producto : any): void{
            //SPIN LOADING
            this.ngxService.start();
            setTimeout(() => {
              this.ngxService.stop();
            }, 100);
            //FIN SPIN LOADING


    this.navigationExtras.state['value'] = producto;
    this.router.navigate(['editar-productos'] , this.navigationExtras);
  }

  // Eliminar Productos
  eliminarProducto(producto : any): void{

    this.listarProductos();
       this.toast.success({detail:"Operación Exitosa",summary:'Se ha Eliminado el Producto!!', duration:2000});
  }



//=========== METODOS PAGINACION ==============

//Ordenar los registros por type
orderByDirection(type:string,direct:string):void{
  this.orderBy = type;
  this.direction = direct;
  this.listarProductos();
}


//Pagina Anterior
paginaAnterior():void{
  if(!this.firstPage){
this.nroPagina--;
this.listarProductos();
  }
}

  //Pagina Anterior
  paginaSiguiente():void{
    if(!this.lastPage){
      this.nroPagina++;
      this.listarProductos();
    }
  }

  cambiarPagina(pagina:number):void{
    this.nroPagina=pagina;
    this.listarProductos();
  }





}
