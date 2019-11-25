
import {throwError as observableThrowError,  Observable} from 'rxjs';

import {catchError,  map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import {AuthenticationService} from './authentication.service'

import 'rxjs/Rx'; 
import { NotificationsBusService } from './notification.service';
import {Tecnico} from '../interfaces/tecnico.interface'
import {Ordenestecnico} from '../interfaces/ordenestecnico.interface'
import {nuevoRepuestoTecnico} from '../interfaces/nuevoserviciotecnico.interface'
import {Orden} from '../interfaces/orden.interface'
import {Ordenservicio} from '../interfaces/ordenservicio.interface'
import {Servicio} from '../interfaces/servicio.interface'


@Injectable({
    providedIn: 'root'
  })

  export class OrdenBusService {
    domain

    constructor(private http:HttpClient, private authservice:AuthenticationService, 
      private NotificationService: NotificationsBusService
      ) {
        this.domain=authservice.server()
    } 

    
    deleteOrden(orden,cliente){
         let parametros={porden: orden,pcliente: cliente}
         return this.http.post(`${this.domain}/api/delorden`,parametros,{headers: new HttpHeaders({
            'authorization': 'true' +' '+localStorage.getItem("token")
           })}).pipe(
          map(res=>{res}));
        }

      
    selectOrden(orden){
     
    return this.http.get(`${this.domain}/api/orden/${orden}`,{headers: new HttpHeaders({
      'authorization': 'true' +' '+localStorage.getItem("token")
     })}).pipe(
     map(res=>res));
     }

     selectComisiones(orden){

      return this.http.get(`${this.domain}/api/tablacomisiones/${orden}`,{headers: new HttpHeaders({
        'authorization': 'true' +' '+localStorage.getItem("token")
       })}).pipe(
       map(res=>res));
       }


       eliminapresupuesto(id){
        var parametros={id: id}
 
        return this.http.post<Orden>(`${this.domain}/api/eliminapresupuesto`, parametros,{headers: new HttpHeaders({
          'authorization': 'true' +' '+localStorage.getItem("token")
         })}).pipe(
      map(res => {
          this.NotificationService.showSuccess("codigo: " ,'Se elimino con exito');
        return res;
         }),catchError((error: any) => {
       
        if (error.status === 500) {
             this.NotificationService.showError(error.error,'Base de Datos');
             return observableThrowError(new Error(error.status));
         }
         else if (error.status === 400) {
             return observableThrowError(new Error(error.status));
         }
         else if (error.status === 409) {
             return observableThrowError(new Error(error.status));
         }
         else if (error.status === 406) {
             return observableThrowError(new Error(error.status));
         }
     }),);

       }


       actualizaPresupuesto(presupuesto){
     
        return this.http.post<Orden>(`${this.domain}/api/actualizapresupuesto`, presupuesto,{headers: new HttpHeaders({
          'authorization': 'true' +' '+localStorage.getItem("token")
         })}).pipe(
      map(res => {
          this.NotificationService.showSuccess("codigo: ",'Se actualizo Correctamente');
        return res;
         }),catchError((error: any) => {
        if (error.status === 500) {
       //      let body = JSON.stringify({ error });    
             this.NotificationService.showError(error.error,'Base de Datos');
             return observableThrowError(new Error(error.status));
         }
         else if (error.status === 400) {
             return observableThrowError(new Error(error.status));
         }
         else if (error.status === 409) {
             return observableThrowError(new Error(error.status));
         }
         else if (error.status === 406) {
             return observableThrowError(new Error(error.status));
         }
     }),);
    }

       creapresupuestoOrden(presupuesto){
        
        return this.http.post<Orden>(`${this.domain}/api/presupuesto`, presupuesto,{headers: new HttpHeaders({
          'authorization': 'true' +' '+localStorage.getItem("token")
         })}).pipe(
      map(res => {
          this.NotificationService.showSuccess("codigo: "+ res['orden'] ,'Se agrego la Orden con Exito');
        return res;
         }),catchError((error: any) => {
        if (error.status === 500) {
       //      let body = JSON.stringify({ error });    
             this.NotificationService.showError(error.error,'Base de Datos');
             return observableThrowError(new Error(error.status));
         }
         else if (error.status === 400) {
             return observableThrowError(new Error(error.status));
         }
         else if (error.status === 409) {
             return observableThrowError(new Error(error.status));
         }
         else if (error.status === 406) {
             return observableThrowError(new Error(error.status));
         }
     }),);

       }
     

addOrden(NewOrden:Orden){
    var propiedad;
    var codigo;
    return this.http.post<Orden>(`${this.domain}/api/orden`, NewOrden,{headers: new HttpHeaders({
        'authorization': 'true' +' '+localStorage.getItem("token")
       })}).pipe(
    map(res => {
  
      this.NotificationService.showSuccess("codigo: "+ res['orden'] ,'Se agrego la Orden con Exito');
     return res;
}),catchError((error: any) => {
      if (error.status === 500) {
     //      let body = JSON.stringify({ error });    
           this.NotificationService.showError(error.error,'Base de Datos');
           return observableThrowError(new Error(error.status));
       }
       else if (error.status === 400) {
           return observableThrowError(new Error(error.status));
       }
       else if (error.status === 409) {
           return observableThrowError(new Error(error.status));
       }
       else if (error.status === 406) {
           return observableThrowError(new Error(error.status));
       }
   }),);
  }
  
  ActualizaOrdenServicio(NewOrden:Orden){
    var propiedad;
    var codigo;
    var nombre;
    if (this.authservice.isLogin){

    return this.http.post(`${this.domain}/api/actordenservicio/${NewOrden.id}`, NewOrden,{headers: new HttpHeaders({
      'authorization': 'true' +' '+localStorage.getItem("token")
     })}).pipe(
    map(res=>{
       let myjson= JSON.stringify(res);

         if (res=="ok"){
           this.NotificationService.showSuccess("Finalizo ","Se actualizo con Exito");
         } else{
            this.NotificationService.showWarn("Warning" ,'No se realizo  ninguna Actualizacion');
         }
          return codigo;
  }),catchError((error: any) => {
    if (error.status === 500) {
       this.NotificationService.showError(error.error,'Base de Datos');
         return observableThrowError(new Error(error.status));
     } 

  }),);
   
  }else{
    this.NotificationService.showError('Error','No Tiene Acceso');
    return
  }

  }


  ActualizaOrden(NewOrden: Orden){
    var propiedad;
    var codigo;
    var nombre;
    if (this.authservice.isLogin){
    
    return this.http.put(`${this.domain}/api/orden/${NewOrden.id}`, NewOrden,{headers: new HttpHeaders({
      'authorization': 'true' +' '+localStorage.getItem("token")
     })}).pipe(
    map(res=>{
       let myjson= JSON.stringify(res);
       
      for (propiedad in res) {
       
          if (propiedad=="ok")
            codigo=res[propiedad];
       } 
         if (codigo==1){
           this.NotificationService.showSuccess("Finalizo ","Se actualizo con Exito");
         } else{
            this.NotificationService.showWarn("Warning" ,'No se realizo  ninguna Actualizacion');
         }
          return codigo;
  }),catchError((error: any) => {
    if (error.status === 500) {
       this.NotificationService.showError(error.error,'Base de Datos');
         return observableThrowError(new Error(error.status));
     } 

  }),);
   
  }else{
    this.NotificationService.showError('Error','No Tiene Acceso');
    return
  } 
}

creaComision(row){

  if (this.authservice.isLogin){
    return this.http.put(`${this.domain}/api/creacomision`,row,{headers: new HttpHeaders({
      'authorization': 'true' +' '+localStorage.getItem("token")
     })}).pipe(
    map(res=>{
     res
  }),catchError((error: any) => {
    if (error.status === 500) {
       this.NotificationService.showError(error.error,'Base de Datos');
         return observableThrowError(new Error(error.status));
     } 

  }),);
   
  }else{
    this.NotificationService.showError('Error','No Tiene Acceso');
    return
  }

}

creaStatusOrden(Status){

  if (this.authservice.isLogin){
    return this.http.put(`${this.domain}/api/createstatusorden`,Status,{headers: new HttpHeaders({
      'authorization': 'true' +' '+localStorage.getItem("token")
     })}).pipe(
    map(res=>{
          res 
  }),catchError((error: any) => {
    if (error.status === 500) {
       this.NotificationService.showError(error.error,'Base de Datos');
         return observableThrowError(new Error(error.status));
     } 

  }),);
   
  }else{
    this.NotificationService.showError('Error','No Tiene Acceso');
    return
  }
}

//Elimina el registro de Status de la Orden
eliminaStatusOrden(id){
  let parametros={id: id}
  if (this.authservice.isLogin){
  return this.http.post(`${this.domain}/api/delstatusorden`,parametros,{headers: new HttpHeaders({
     'authorization': 'true' +' '+localStorage.getItem("token")
    })}).pipe(
     map(res=>{
         if (res=="ok"){
           this.NotificationService.showSuccess("Finalizo ","Se Elimino con Exito");
         } else{
            this.NotificationService.showWarn("Warning" ,'No se realizo  ninguna Actualizacion');
         }
          return 
  }),catchError((error: any) => {
    if (error.status === 500) {
       this.NotificationService.showError(error.error,'Base de Datos');
         return observableThrowError(new Error(error.status));
     } 

  }),);
   }else{
           this.NotificationService.showError('Error','No Tiene Acceso');
            return
        }
    }

//actualiza la tabla de status de la orden.
actualizaStatusOden(status){
let codigo
  if (this.authservice.isLogin){
    return this.http.put(`${this.domain}/api/actualizastatusorden`, status,{headers: new HttpHeaders({
     'authorization': 'true' +' '+localStorage.getItem("token")
    })}).pipe(
       map(res=>{
           if (res=="ok"){
          this.NotificationService.showSuccess("Finalizo ","Se actualizo el repuesto con  Exito");
         } else{
          this.NotificationService.showWarn("Warning" ,'No se realizo  ninguna Actualizacion');
         }
        return codigo;
}),catchError((error: any) => {
  if (error.status === 500) {
     this.NotificationService.showError(error.error,'Base de Datos');
       return observableThrowError(new Error(error.status));
   } 

 }),);
 }else{
  this.NotificationService.showError('Error','No Tiene Acceso');
  return
 } 
}


actualizaRepuestoTecnico(repuesto){
  let propiedad
  let codigo

  if (this.authservice.isLogin){
     
    return this.http.put(`${this.domain}/api/actualizarepuesto`, repuesto,{headers: new HttpHeaders({
     'authorization': 'true' +' '+localStorage.getItem("token")
    })}).pipe(
       map(res=>{
           if (res=="ok"){
          this.NotificationService.showSuccess("Finalizo ","Se actualizo el repuesto con  Exito");
         } else{
          this.NotificationService.showWarn("Warning" ,'No se realizo  ninguna Actualizacion');
         }
        return codigo;
}),catchError((error: any) => {
  if (error.status === 500) {
     this.NotificationService.showError(error.error,'Base de Datos');
       return observableThrowError(new Error(error.status));
   } 

 }),);
 }else{
  this.NotificationService.showError('Error','No Tiene Acceso');
  return
 } 
}


ActualizaOrdenTecnico(Traslado,Orden: Orden,Tecnico:Tecnico){
   var propiedad;
   var codigo;
 
   if (this.authservice.isLogin){
     
     return this.http.put(`${this.domain}/api/ordentecnico/${Orden.id}/${Tecnico.email}/${Tecnico.observaciones}/${Traslado}`, Orden,{headers: new HttpHeaders({
      'authorization': 'true' +' '+localStorage.getItem("token")
     })}).pipe(
        map(res=>{
          let myjson= JSON.stringify(res);
      
          for (propiedad in res) {
      
         if (propiedad=="ok")
           codigo=res[propiedad];
      } 
        if (codigo==1){
          this.NotificationService.showSuccess("Finalizo ","Se actualizo y se envio la Orden al Tecnico con Exito");
        } else{
           this.NotificationService.showWarn("Warning" ,'No se realizo  ninguna Actualizacion');
        }
         return codigo;
 }),catchError((error: any) => {
   if (error.status === 500) {
      this.NotificationService.showError(error.error,'Base de Datos');
        return observableThrowError(new Error(error.status));
    } 
 
 }),);
}else{
  this.NotificationService.showError('Error','No Tiene Acceso');
  return
} 
}

// crea el registro del servicio de revision del tecnico.

eliminaImagenTecnico(orden,idfoto) 
{ 
let parametros={id: idfoto,orden: orden}
if (this.authservice.isLogin){
return this.http.post(`${this.domain}/api/delimagentecnico`,parametros,{headers: new HttpHeaders({
   'authorization': 'true' +' '+localStorage.getItem("token")
  })}).pipe(
   map(res=>{
       if (res=="ok"){
         this.NotificationService.showSuccess("Finalizo ","Se Elimino con Exito");
       } else{
          this.NotificationService.showWarn("Warning" ,'No se realizo  ninguna Actualizacion');
       }
        return 
}),catchError((error: any) => {
  if (error.status === 500) {
     this.NotificationService.showError(error.error,'Base de Datos');
       return observableThrowError(new Error(error.status));
   } 

}),);
 }else{
         this.NotificationService.showError('Error','No Tiene Acceso');
          return
      }
  }



  eliminarRepuestoTecnico(id,orden){
  let parametros={id: id,orden: orden}
  if (this.authservice.isLogin){
  return this.http.post(`${this.domain}/api/delrepuestotecnico`,parametros,{headers: new HttpHeaders({
     'authorization': 'true' +' '+localStorage.getItem("token")
    })}).pipe(
     map(res=>{
         if (res=="ok"){
           this.NotificationService.showSuccess("Finalizo ","Se Elimino con Exito");
         } else{
            this.NotificationService.showWarn("Warning" ,'No se realizo  ninguna Actualizacion');
         }
          return 
  }),catchError((error: any) => {
    if (error.status === 500) {
       this.NotificationService.showError(error.error,'Base de Datos');
         return observableThrowError(new Error(error.status));
     } 

  }),);
   }else{
           this.NotificationService.showError('Error','No Tiene Acceso');
            return
        }
    }

    creaImagenTecnico(objeto){
      if (this.authservice.isLogin){
             return this.http.put(`/api/creaimagentecnico`,objeto,{
              headers: new HttpHeaders({
             'authorization': 'true' +' '+localStorage.getItem("token")
             })}).pipe(
             map(res=>{
             if (res=="ok"){
               this.NotificationService.showSuccess("Finalizo ","Se ingreso con Exito");
             } else{
                this.NotificationService.showWarn("Warning" ,'No se realizo  ninguna Actualizacion');
             }
              return 
      }),catchError((error: any) => {
    
          if (error.status === 500) {
          
           this.NotificationService.showError(error.error,'Base de Datos');
             return observableThrowError(new Error(error.status));
         } 
    
       }),);
       }else{
        this.NotificationService.showError('Error','No Tiene Acceso');
        return
       }
      }


      leeImagenTecnico(orden,idservicio){
 
        if (this.authservice.isLogin){
               return this.http.get(`/api/leeimagentecnico`,{
               params: new HttpParams()
              .set('orden',orden)
              .set('idservicio',idservicio),
               headers: new HttpHeaders({
               'authorization': 'true' +' '+localStorage.getItem("token")
               })})
               .pipe(
                map(res =>  res)).pipe(
               catchError((error: any) => {
        
               if (error.status === 500) {
            
                 this.NotificationService.showError(error.error,'Base de Datos');
                 return observableThrowError(new Error(error.status));
               } 
      
        }));
        }else{
              this.NotificationService.showError('Error','No Tiene Acceso');
             return
         }
        }

     actualizaServicioTecnico( servicioTecnico ){
      if (this.authservice.isLogin){
       
        return this.http.put(`${this.domain}/api/actualizaserviciotecnico`,servicioTecnico,{headers: new HttpHeaders({
          'authorization': 'true' +' '+localStorage.getItem("token")
         })}).pipe(
        map(res=>{
             if (res=="ok"){
               this.NotificationService.showSuccess("Finalizo ","Se ingreso con Exito");
             } else{
                this.NotificationService.showWarn("Warning" ,'No se realizo  ninguna Actualizacion');
             }
              return 
      }),catchError((error: any) => {
        if (error.status === 500) {
           this.NotificationService.showError(error.error,'Base de Datos');
             return observableThrowError(new Error(error.status));
         } 
    
      }),);
       
      }else{
        this.NotificationService.showError('Error','No Tiene Acceso');
        return
      }
    
    }


    creaServicioTecnico( servicioTecnico ){
   
     if (this.authservice.isLogin){
       
        return this.http.put(`${this.domain}/api/creaserviciotecnico`,servicioTecnico,{headers: new HttpHeaders({
          'authorization': 'true' +' '+localStorage.getItem("token")
         })}).pipe(
        map(res=>res
        ),catchError((error: any) => {
        if (error.status === 500) {
           this.NotificationService.showError(error.error,'Base de Datos');
             return observableThrowError(new Error(error.status));
         } 
    
      }),);
       
      }else{
        this.NotificationService.showError('Error','No Tiene Acceso');
        return
      }
    
    }


 creaRepuestoDetalleTecnico(detallerepuesto){
      if (this.authservice.isLogin){
        return this.http.put(`${this.domain}/api/creadetallerepuesto`,detallerepuesto,{headers: new HttpHeaders({
          'authorization': 'true' +' '+localStorage.getItem("token")
         })}).pipe(
        map(res=>{
             if (res=="ok"){
               this.NotificationService.showSuccess("Finalizo ","Se ingreso con Exito");
             } else{
                this.NotificationService.showWarn("Warning" ,'No se realizo  ninguna Actualizacion');
             }
              return 
      }),catchError((error: any) => {
        if (error.status === 500) {
           this.NotificationService.showError(error.error,'Base de Datos');
             return observableThrowError(new Error(error.status));
         } 
    
      }),);
       
      }else{
        this.NotificationService.showError('Error','No Tiene Acceso');
        return
      }
  }


  creaRepuestoTecnico( servicioTecnico:nuevoRepuestoTecnico ){
  if (this.authservice.isLogin){
   
    return this.http.put(`${this.domain}/api/repuestotecnico`,servicioTecnico,{headers: new HttpHeaders({
      'authorization': 'true' +' '+localStorage.getItem("token")
     })}).pipe(
    map(res=>{
         if (res=="ok"){
           this.NotificationService.showSuccess("Finalizo ","Se ingreso con Exito");
         } else{
            this.NotificationService.showWarn("Warning" ,'No se realizo  ninguna Actualizacion');
         }
          return 
  }),catchError((error: any) => {
    if (error.status === 500) {
       this.NotificationService.showError(error.error,'Base de Datos');
         return observableThrowError(new Error(error.status));
     } 

  }),);
   
  }else{
    this.NotificationService.showError('Error','No Tiene Acceso');
    return
  }

}


GetOrdenesTecnico(Orden){
  if (this.authservice.isLogin){
    return this.http.get<Servicio[]>(`${this.domain}/api/leeserviciotecnico`,{
      params: new HttpParams()
      .set('orden',Orden),
      headers: new HttpHeaders({
      'authorization': 'true' +' '+localStorage.getItem("token")
     })}).pipe(
    map(res=>res));
  }else{
    this.NotificationService.showError('Error','No Tiene Acceso');
    return
  } 

}

public LeeServicioTecnico(Orden){
  if (this.authservice.isLogin){ 
 
     return this.http.get<Servicio[]>(`${this.domain}/api/leeserviciotecnico`, {
    params: new HttpParams()
        .set('orden',Orden)
        ,headers: new HttpHeaders({
        'authorization': 'true' +' '+localStorage.getItem("token")
         })
        }).pipe(
        map(res =>  res));
       }else{
          this.NotificationService.showError('Error','No Tiene Acceso');
    return  
  }
}



public getrepuestoTecnicoDetalle(Id:string,Orden :string,Estado :string,Responsable :string, filter:string, sortOrder:string,
  pageNumber, pageSize,sortfield){
    if (this.authservice.isLogin){ 
         return this.http.get<Ordenestecnico[]>(`/api/detallerepuestotecnico`, {
         params: new HttpParams()
             .set('orden',Orden)
             .set('Id',Id)
             .set('estado',Estado)
             .set('responsable', Responsable)
             .set('filter', filter)
             .set('sortOrder', sortOrder)
             .set('pageNumber', pageNumber.toString())
             .set('pageSize', pageSize.toString())
             .set('sortfield',sortfield)
             ,headers: new HttpHeaders({
              'authorization': 'true' +' '+localStorage.getItem("token")
             })
           }).pipe(
              map(res =>  res));
           }else{
              this.NotificationService.showError('Error','No Tiene Acceso');
              return  
            }

      }


public getordenTecnico(Orden :string,Estado :string,Responsable :string, filter:string, sortOrder:string,
  pageNumber, pageSize,sortfield){
    if (this.authservice.isLogin){ 
         return this.http.get<Ordenestecnico[]>(`/api/ordenestecnico`, {
         params: new HttpParams()
             .set('orden',Orden)
             .set('estado',Estado)
             .set('responsable', Responsable)
             .set('filter', filter)
             .set('sortOrder', sortOrder)
             .set('pageNumber', pageNumber.toString())
             .set('pageSize', pageSize.toString())
             .set('sortfield',sortfield)
             ,headers: new HttpHeaders({
              'authorization': 'true' +' '+localStorage.getItem("token")
             })
           }).pipe(
              map(res =>  res));
           }else{
              this.NotificationService.showError('Error','No Tiene Acceso');
              return  
            }

      }

public getOrden(
  Orden :string,Estado :string,Responsable :string, filter:string, sortOrder:string,
 pageNumber, pageSize,sortfield):  Observable<Orden[]> {
  if (this.authservice.isLogin){ 
  return this.http.get<Orden[]>(`${this.domain}/api/ordenes`, {
     params: new HttpParams()
         .set('orden',Orden)
         .set('estado',Estado)
         .set('responsable', Responsable)
         .set('filter', filter)
         .set('sortOrder', sortOrder)
         .set('pageNumber', pageNumber.toString())
         .set('pageSize', pageSize.toString())
         .set('sortfield',sortfield)
         ,headers: new HttpHeaders({
          'authorization': 'true' +' '+localStorage.getItem("token")
         })
       }).pipe(
          map(res =>  res));
       }else{
          this.NotificationService.showError('Error','No Tiene Acceso');
          return  
        }
     }
      
    

  public getOrdenes(
    Orden :string,Estado :string,Responsable :string, filter:string, sortOrder:string,
   pageNumber, pageSize,sortfield):  Observable<Orden[]> {
    if (this.authservice.isLogin){ 
    return this.http.get<Orden[]>(`${this.domain}/api/tordenes`, {
       params: new HttpParams()
           .set('orden',Orden)
           .set('estado',Estado)
           .set('responsable', Responsable)
           .set('filter', filter)
           .set('sortOrder', sortOrder)
           .set('pageNumber', pageNumber.toString())
           .set('pageSize', pageSize.toString())
           .set('sortfield',sortfield)
           ,headers: new HttpHeaders({
            'authorization': 'true' +' '+localStorage.getItem("token")
           })
         }).pipe(
            map(res =>  res));
         }else{
            this.NotificationService.showError('Error','No Tiene Acceso');
            return  
          }
       }
     
  

  public getActualizaOrden(
    filter:string):  Observable<Ordenservicio[]> {
     
    return this.http.get<Ordenservicio[]>(`${this.domain}/api/actualizaordenes`, {
       params: new HttpParams()
           .set('filter', filter)
        ,headers: new HttpHeaders({
            'authorization': 'true' +' '+localStorage.getItem("token")
           })
         }).pipe(
            map(res =>  res));
       }  
} 
