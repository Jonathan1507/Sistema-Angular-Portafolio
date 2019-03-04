import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Producto } from '../interfaces/producto.interface'

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  cargando = true;
  productos : Producto [] = [];
  productosFiltrado: Producto[] = [];

  constructor( private http: HttpClient ) {
      this.cargarProductos();
   }

  private cargarProductos(){

    return new Promise( ( resolve, reject ) =>{
      this.http.get('https://sistema-demo.firebaseio.com/productos_idx.json')
        .subscribe((resp: Producto [])=>{
           this.productos=resp;
          setTimeout(() => {
              this.cargando=false;
              resolve();
          }, 2000);
        });
    });
  }

    getProducto(id: string){
      return this.http.get(`https://sistema-demo.firebaseio.com/productos/${ id }.json`);
    }

  buscarProducto( termino: string ){

    if(this.productos.length === 0){
      //Cargar producto
      this.cargarProductos().then(()=>{
        //Ejutar despues detener los ProductosService
        //Aplicar filtro
        this.filtrarProductos(termino);
      });
    }else{
      //Aplicamos el filtro
      this.filtrarProductos(termino);
    }
  }

  private filtrarProductos(termino:string){
    console.log(this.productos);
    this.productosFiltrado = [];
    termino = termino.toLocaleLowerCase();
    this.productos.forEach(prod =>{
      const tituloLower = prod.titulo.toLocaleLowerCase();
      if(prod.categoria.indexOf(termino) >= 0 || tituloLower.indexOf(termino) >= 0 ){
        this.productosFiltrado.push(prod);
      }
    });
  }
}