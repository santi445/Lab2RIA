import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-ejemplo-componente2',
  templateUrl: './ejemplo-componente2.component.html',
  styleUrls: ['./ejemplo-componente2.component.css']
})
export class EjemploComponente2 implements OnInit {

  pokemonList: { name: string, spriteUrl: string }[] = []; // Variable para almacenar los nombres y sprites de los Pokémon
  page: number = 1;
  searchText: string = ''; // Variable para la búsqueda
  sortBy: string = ''; // Variable para almacenar la columna por la que se está ordenando
  sortOrder: string = 'asc'; // Variable para almacenar el orden de clasificación (ascendente o descendente)

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
        const uniquePokemonNames: Set<string> = new Set();

        // Extraer todas las URLs de Pokémon y crear array de observables para sus detalles
        pages.forEach((page: any) => {
          page.results.forEach((pokemon: any) => {
            const baseName = pokemon.name.split('-')[0];
            if (!uniquePokemonNames.has(baseName)) {
              uniquePokemonNames.add(baseName);
              pokemonRequests.push(this.http.get<any>(pokemon.url).pipe(
                map(details => ({
                  name: baseName,
                  spriteUrl: details.sprites.front_default
                })),
                catchError(error => {
                  console.error('Error fetching details for:', pokemon.name, error);
                  return of({ name: baseName, spriteUrl: '' });
                })
              ));
            }
          });
        });

        return forkJoin(pokemonRequests);
      })
    ).subscribe(pokemonDetails => {
      this.pokemonList = pokemonDetails;
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
}
