import { Component, OnInit, ViewChild } from '@angular/core';
import Annotation from 'chartjs-plugin-annotation';
import { BaseChartDirective } from 'ng2-charts';
import { ApiConnectionService } from '../services/api-connection.service';
import { Chart, ChartConfiguration, ChartOptions, ChartEvent, ChartType } from 'chart.js';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  tiempoSeleccionado: number = 15;

  constructor(private apiConsulta: ApiConnectionService) {
    Chart.register(Annotation);
    this.chart?.update();
  }
  public lineChartDataDB: ChartConfiguration<'line'>['data'] = {
    datasets: [
      {
        data: [],
        label: 'Temperatura',
        backgroundColor: 'rgba(238, 52, 76, 0.3)',
        borderColor: 'black',
        pointBackgroundColor: 'black',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'black',
        fill: 'origin',
      },
      {
        data: [],
        label: 'Humedad',
        backgroundColor: 'rgba(29, 249, 64, 0.9)',
        borderColor: 'black',
        pointBackgroundColor: 'black',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'black',
        fill: 'origin',
      },
    ],
  };
  lineChartOptionsDB: ChartOptions<'line'> = {
    responsive: false
  };

  lineChartLegendDB = true;

  ngOnInit(): void {
    this.inicializaHistorial();
  }

  repintaHistorial(): void {
    this.lineChartDataDB.labels = [];
    this.lineChartDataDB.datasets[0].data = [];
    this.lineChartDataDB.datasets[1].data = [];
    this.inicializaHistorial();
  }

  inicializaHistorial(): void {
    this.apiConsulta.getDatos$().subscribe(data => {
      // console.log(data);
      // Tiempo Default 15 minutos
      // 1. Calcular la hora actual
      // 2. Calcular la hora actual - 15 minutos
      // 3. Todo valor entre Hora actual a Hora actual - 15 minutos se muestra

      let horaActual: Date = this.obtenerHoraActual();

      let horaActualMinusDefault: Date = horaActual;
      horaActualMinusDefault.setMinutes(horaActualMinusDefault.getMinutes() - this.tiempoSeleccionado);

      let tempDate: Date | null;
      for (let i of data) {
        tempDate = this.convertStringToDate(i.date);
        if (tempDate && (tempDate > horaActualMinusDefault)) {
          console.log("entra: " + tempDate + "porque es mayor a" + horaActualMinusDefault);

          if (i.sensor == 'TEMP') {
            this.lineChartDataDB.labels?.push(i.date);
            this.lineChartDataDB.datasets[0].data.push(i.value);
            this.chart?.update();
          } else {
            this.lineChartDataDB.datasets[1].data.push(i.value);
            this.chart?.update();
          }
        }
      }
    });
  }

  obtenerHoraActual(): Date {
    const ahora: Date = new Date();
    return ahora;
  }

  convertStringToDate(dateString: string): Date | null {
    // El formato que llega de la BD es "day/month/year, hour:minute:second"
    const [datePart, timePart] = dateString.split(', ');
    const [day, month, year] = datePart.split('/');
    const [hour, minute, second] = timePart.split(':');

    if (!day || !month || !year || !hour || !minute || !second) {
      console.error("Invalid date string format");
      return null;
    }

    const dateObject: Date = new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1, // Months are zero-based
      parseInt(day, 10),
      parseInt(hour, 10),
      parseInt(minute, 10),
      parseInt(second, 10)
    );

    return dateObject;
  }

}
