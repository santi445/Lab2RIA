import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Route } from '@angular/router';
interface entry{juego: string; texto:string;}


@Component({
  selector: 'app-nuevo-componente',
  templateUrl: './nuevo-componente.component.html',
  styleUrls: ['./nuevo-componente.component.css']
})
export class NuevoComponenteComponent implements OnInit {
  nombre: string = '';
  types: any[] = [];
  spriteUrl: string = '';
  artworkUrl: string = '';
  altura: number = 0;
  peso: number = 0;
  id: number = 0;
  entries: entry[] = [];
  currentIndex = 0; // Initial index


  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}


  goForward() {
    if (this.currentIndex < this.entries.length - 1) {
      this.currentIndex++;
    }
  }

  goBackward() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.nombre = params['nombrePokemon'];
      this.getPokemonDetails(this.nombre);
      this.getPokemonDescriptions(this.nombre);
    });
  }

  async getPokemonDetails(nombre: string): Promise<void> {
    const url = `https://pokeapi.co/api/v2/pokemon/${nombre}`;
    try {
      const response = await this.http.get<any>(url).toPromise();
      this.types = response.types.map((typeInfo: any) => typeInfo.type.name);
      this.spriteUrl = response.sprites.front_default;
      this.artworkUrl = response.sprites.other['official-artwork'].front_default;
      this.altura = response.height;
      this.peso = response.weight;
      this.id = response.id;
    } catch (error) {
      console.error('Error fetching Pokémon details:', error);
    }
  }

  async getPokemonDescriptions(nombre: string): Promise<void> {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${nombre}`;
    try {
      const response = await this.http.get<any>(url).toPromise();
      this.entries = response.flavor_text_entries
        .filter((entry: any) => entry.language.name === 'es')
        .map((entry: any) => ({ juego: entry.version.name, texto: entry.flavor_text }));
      console.log(this.entries);
    } catch (error) {
      console.error('Error fetching Pokémon descriptions:', error);
    }
  }
}
