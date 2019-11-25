export interface Cliente {
     _id?:string;
       n?:number;
       isDone: boolean;
       code:number;
       firstName: string;
       lastName:string;
       nit:string;
       dpi:number;
       state:number;
       city:number;
       address:string;
       address2:string;
       email:string;
       email2:string;
       telephonework:string;
       telephonemovile:string;
       telephonehouse:string;
       mantenimiento?:number; 
       notemail:boolean;
}