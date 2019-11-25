export interface Traslado {
    _id?:string;
      id:number;
      orden:number;
      firstName: string;
      lastName:string;
      fecha_recepcion: Date;
      fecha_entrega: Date;
      estado:number;
      usrrecibe:string;
      usrenvia:string;
      servicio:string;
      observaciones:string;
      modelo:string;
      marca:number;
      comentarios:string;
      id_anterior:number;
      ubicacion:number;
      statusanterior:number;
      statusnuevo:number;
      ubicacionfinal:number;  
      tipo:string;
      usractualiza:string;
      tienda:string;
}