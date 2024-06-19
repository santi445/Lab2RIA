import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Route } from '@angular/router';

@Component({
  selector: 'app-tipo',
  templateUrl: './tipo.component.html',
  styleUrls: ['./tipo.component.css']
})
export class TipoComponent {
  nombre: string = '';
  dobleDanioTo: string[] = [];
  dobleDanioFrom: string[] = [];
  mitadDanioTo: string[] = [];
  mitadDanioFrom: string[] = [];
  noDanioTo: string[]= [];
  noDanioFrom: string[] = [];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.nombre = params['nombreTipo'];
      console.log('tipo: ', this.nombre);
      this.getTipoDetails(this.nombre);
    });
  }

  async getTipoDetails(nombre: string): Promise<void> {
    const url = `https://pokeapi.co/api/v2/type/${nombre}`;
    try {
      const response = await this.http.get<any>(url).toPromise();

      this.dobleDanioTo = response.damage_relations.double_damage_to.map((typeInfo: any) => typeInfo.name);
      this.dobleDanioFrom = response.damage_relations.double_damage_from.map((typeInfo: any) => typeInfo.name);
      this.mitadDanioTo = response.damage_relations.half_damage_to.map((typeInfo: any) => typeInfo.name);
      this.mitadDanioFrom = response.damage_relations.half_damage_from.map((typeInfo: any) => typeInfo.name);
      this.noDanioTo = response.damage_relations.no_damage_to.map((typeInfo: any) => typeInfo.name);
      this.noDanioFrom = response.damage_relations.no_damage_from.map((typeInfo: any) => typeInfo.name);
      console.log('doble danio a:', this.dobleDanioTo);
      console.log('doble danio de:', this.dobleDanioFrom);
      
      
    } catch (error) {
      console.error('Error fetching Pokémon details:', error);
    }
  }

}
