// src/app/services/socket-conection.service.ts
import { Injectable } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketConectionService {
  // Stub temporal: no inyectamos nada hasta reinstalar ngx-socket-io en Angular 20
  private conection: any = null;

  constructor() {}

  public getInfo$(): Observable<any> {
    // Si no hay socket (fase de migración), no emite nada y no rompe
    if (!this.conection || typeof this.conection.on !== 'function') {
      return EMPTY;
    }

    return new Observable((infoSocket) => {
      const onConnect = () => console.log('Conectado');
      const onData = (data: any) => {
        console.log('Datos');
        infoSocket.next(data);
      };
      const onDisconnect = () => infoSocket.complete();
      const onError = (e: any) => infoSocket.error(e);

      try {
        // (Ojo: si era un typo, debería ser 'connect' y no 'conect')
        this.conection.on('conect', onConnect);
        this.conection.on('iot/sensores', onData);
        this.conection.on('disconnect', onDisconnect);
        this.conection.on('error', onError);
      } catch (e) {
        infoSocket.error(e);
      }

      // Teardown: desregistrar handlers al desuscribir
      return () => {
        try {
          this.conection?.off?.('conect', onConnect);
          this.conection?.off?.('iot/sensores', onData);
          this.conection?.off?.('disconnect', onDisconnect);
          this.conection?.off?.('error', onError);
        } catch {}
      };
    });
  }
}
