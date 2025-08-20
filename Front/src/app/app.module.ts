import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgChartsModule } from 'ng2-charts';
import { MatGridListModule } from '@angular/material/grid-list';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatCardModule } from '@angular/material/card';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HistorialComponent } from './historial/historial.component';
import { SensorTempComponent } from './sensor-temp/sensor-temp.component';
import { SensorHumedadComponent } from './sensor-humedad/sensor-humedad.component';
import { FormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HistorialComponent,
    SensorTempComponent,
    SensorHumedadComponent
  ],
  bootstrap: [AppComponent],
  imports: [MatCardModule,
    MatGridListModule,
    BrowserModule,
    AppRoutingModule,
    NgChartsModule,
    SocketIoModule.forRoot(config),
    FormsModule],
  providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class AppModule { }
