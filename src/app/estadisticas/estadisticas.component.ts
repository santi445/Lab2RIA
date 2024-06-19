import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import * as apex from 'ng-apexcharts';
import { ChartComponent } from 'ng-apexcharts';

export type ChartOptions = {
  series: apex.ApexAxisChartSeries;
  chart: apex.ApexChart;
  xaxis: apex.ApexXAxis;
  title: apex.ApexTitleSubtitle;
  plotOptions: apex.ApexPlotOptions;
};

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {
  @ViewChild("chart", {static: false}) chart: ChartComponent | any;
  public chartOptions: Partial<ChartOptions> | any;
  nombreEstadistica: string[] = [];
  valorEstadistica: number[] = [];
  nombrePokemon: string = '';
  //xaxis: apex.ApexXAxis = {};
  //series: apex.ApexAxisChartSeries = [];
  //chart: apex.ApexChart = {type: 'bar', width: 1000};
  //title: apex.ApexTitleSubtitle = {};
  //plotOptions: apex.ApexPlotOptions = {bar:{horizontal:true}};

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.nombrePokemon = params['nombrePokemon'];
    });
    this.getStats(this.nombrePokemon);

  }

  async getStats(nombrePokemon: string): Promise<void> {
    const url = `https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`;
    try {
      const response = await this.http.get<any>(url).toPromise();
      this.nombreEstadistica = response.stats.map((statInfo: any) => statInfo.stat.name);
      this.valorEstadistica = response.stats.map((statInfo: any) => statInfo.base_stat);

      this.chartOptions = {
        series:[{
          name: 'Estadistica',
          data: this.valorEstadistica
        }],
        chart: {type: 'bar'}, 
        xaxis:{categories: this.nombreEstadistica}, 
        title: {text:'Estadisticas de ' + nombrePokemon},
        plotOptions:{bar:{horizontal:true}}
    };
/*
      this.xaxis = {
        categories: this.nombreEstadistica
      };

      this.title={text:'Estadisticas de ' + nombrePokemon};

      this.series = [{
        name: 'Estadistica',
        data: this.valorEstadistica
      }];

*/   

      //window.dispatchEvent(new Event ('resize'));
    } catch (error) {
      console.error('Error fetching Pokémon details:', error);
    }
  }
}
