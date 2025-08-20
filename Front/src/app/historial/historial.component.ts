import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartOptions } from 'chart.js';
import Annotation from 'chartjs-plugin-annotation';
import { ApiConnectionService, InfoDto } from '../services/api-connection.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css'],
  standalone: false
})
export class HistorialComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  // minutos a consultar
  tiempoSeleccionado = 15;

  constructor(private apiConsulta: ApiConnectionService) {
    Chart.register(Annotation);
  }

  public lineChartDataDB: ChartConfiguration<'line'>['data'] = {
    labels: [],
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

  public lineChartOptionsDB: ChartOptions<'line'> = {
    responsive: false
  };

  public lineChartLegendDB = true;

  ngOnInit(): void {
    this.cargarHistorial();
  }

  repintaHistorial(): void {
    this.lineChartDataDB.labels = [];
    this.lineChartDataDB.datasets[0].data = [];
    this.lineChartDataDB.datasets[1].data = [];
    this.cargarHistorial();
  }

  private cargarHistorial(): void {
    this.apiConsulta.getUltimosMin$(this.tiempoSeleccionado).subscribe((rows: InfoDto[]) => {
      // Aseguramos orden por fecha
      rows.sort((a, b) => +new Date(a.date) - +new Date(b.date));

      const labels: string[] = [];
      const tempData: number[] = [];
      const humData: number[] = [];

      for (const r of rows) {
        const label = new Date(r.date).toLocaleString();

        if (r.sensor === 'TEMP') {
          labels.push(label);
          tempData.push(r.value);
        } else if (r.sensor === 'HUM') {
          humData.push(r.value);
        }
      }

      this.lineChartDataDB.labels = labels;
      this.lineChartDataDB.datasets[0].data = tempData;
      this.lineChartDataDB.datasets[1].data = humData;

      this.chart?.update();
    });
  }
}
