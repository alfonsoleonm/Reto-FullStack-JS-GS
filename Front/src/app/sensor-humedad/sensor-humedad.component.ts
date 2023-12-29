import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartOptions} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { default as Annotation } from 'chartjs-plugin-annotation';
import { SocketConectionService } from '../services/socket-conection.service';
import { ApiConnectionService } from '../services/api-connection.service';

@Component({
  selector: 'app-sensor-humedad',
  templateUrl: './sensor-humedad.component.html',
  styleUrls: ['./sensor-humedad.component.css']
})
export class SensorHumedadComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  constructor(private socketConection: SocketConectionService) {
    Chart.register(Annotation);
    this.chart?.update();
  }

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    datasets: [
      {
        data: [],
        label: 'Humedad',
        backgroundColor: 'rgba(29, 249, 64, 0.8)',
        borderColor: 'black',
        pointBackgroundColor: 'black',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'black',
        fill: 'origin',
      },
    ],
  };
  lineChartOptions: ChartOptions<'line'> = {
    responsive: false
  };

  lineChartLegend = false;
  lasthum: number = 0;

  ngOnInit() {
    this.socketConection.getInfo$().subscribe(infoSocket => {
      var date = new Date();
      var ejex = date.toLocaleString();
      const [HUM, TEMP] = infoSocket.data;
      this.lasthum = HUM.value;
      this.lineChartData.datasets[0].data.push(HUM.value);
      this.lineChartData.labels?.push(ejex);
      this.chart?.update();
    });
  }

}
