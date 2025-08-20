import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';

@Injectable({ providedIn: 'root' })
export class SocketConectionService {
  constructor(private connection: Socket) {}

  public getInfo$(): Observable<any> {
    return new Observable((infoSocket) => {
      const onConnect = () => console.log('Conectado');
      const onData = (data: any) => infoSocket.next(data);
      const onDisconnect = () => infoSocket.complete();
      const onError = (e: any) => infoSocket.error(e);

      this.connection.on('connect', onConnect);
      this.connection.on('iot/sensores', onData);
      this.connection.on('disconnect', onDisconnect);
      this.connection.on('error', onError);

      return () => {
        this.connection.off('connect', onConnect);
        this.connection.off('iot/sensores', onData);
        this.connection.off('disconnect', onDisconnect);
        this.connection.off('error', onError);
      };
    });
  }
}
