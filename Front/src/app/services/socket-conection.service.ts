import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { observable, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketConectionService {

  constructor(
    private conection:Socket 
  ) { }

  public getInfo$():Observable<any>{
    
    return new Observable(infoSocket => {
      try{
        this.conection.on('conect',()=>{
        console.log('Conectado');
        })
        this.conection.on('iot/sensores',(data: any)=>{
        console.log('Datos');
        infoSocket.next(data);
        })
        this.conection.on('disconnect',()=>{
        infoSocket.complete();
        })
        this.conection.on('error',(e:any)=>{
        infoSocket.error(e);
        })
        }catch(e){
        infoSocket.error(e);
        }
    } ); 
  }
}
