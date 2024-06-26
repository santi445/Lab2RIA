import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-ejemplo-componente2',
  templateUrl: './ejemplo-componente2.component.html',
  styleUrls: ['./ejemplo-componente2.component.css']
})
export class EjemploComponente2 implements OnInit {

  pokemonList: { name: string, spriteUrl: string, types: string[] }[] = [];
  page: number = 1;
  itemsPerPage: number = 10;
  searchText: string = '';
  sortBy: string = '';
  sortOrder: string = 'asc';
  loading: boolean = true; // Bandera de carga inicializada como true

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.listarPokemons();
  }

  listarPokemons() {
    const endpoint = 'https://pokeapi.co/api/v2/pokemon';
    
    this.http.get<any>(`${endpoint}?limit=1`).pipe(
      switchMap(response => {
        const totalPokemons = response.count;
        const requests: Observable<any>[] = [];

        // Crear array de observables para todas las páginas
        for (let offset = 0; offset < totalPokemons; offset += 100) {
          requests.push(this.http.get<any>(`${endpoint}?offset=${offset}&limit=100`));
        }

        return forkJoin(requests);
      }),
      switchMap(pages => {
        const pokemonRequests: Observable<any>[] = [];

        // Iterar sobre todas las páginas y obtener detalles de cada Pokémon
        pages.forEach((page: any) => {
          page.results.forEach((pokemon: any) => {
            pokemonRequests.push(this.http.get<any>(pokemon.url).pipe(
              map(details => ({
                name: pokemon.name,
                spriteUrl: details.sprites.front_default === null ? details.sprites.other['official-artwork'].front_default : details.sprites.front_default,
                types: details.types.map((slot: any) => slot.type.name)
              })),
              catchError(error => {
                console.error('Error fetching details for:', pokemon.name, error);
                return of({ name: pokemon.name, spriteUrl: '', types: [] });
              })
            ));
          });
        });

        return forkJoin(pokemonRequests);
      })
    ).subscribe(pokemonDetails => {
      this.pokemonList = pokemonDetails;
      this.loading = false;
      console.log('All Pokémon listed:', this.pokemonList);
    });
  }

  sort(column: string) {
    if (column === this.sortBy) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = 'asc';
    }
  }

  navigateToType(type: string) {
    this.router.navigate(['/tipo', type]);
  }
}
