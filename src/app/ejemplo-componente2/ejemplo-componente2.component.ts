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
  searchText: string = '';
  sortBy: string = '';
  sortOrder: string = 'asc';
  loading: boolean = true; // Bandera de carga inicializada como true

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.listarPokemons();
  }

  listarPokemons() {
    const limit = 100; // Cantidad de Pokémon por página
    const totalPokemons = 1010; // Total de Pokémon a obtener
    const totalPages = Math.ceil(totalPokemons / limit); // Calcular total de páginas

    // Crear observables para todas las páginas
    const requests: Observable<any>[] = [];
    for (let page = 1; page <= totalPages; page++) {
      requests.push(this.http.get<any>(`https://pokeapi.co/api/v2/pokemon?offset=${(page - 1) * limit}&limit=${limit}`));
    }

    forkJoin(requests).pipe(
      tap(pages => console.log('Total pages fetched:', pages.length)),
      switchMap(pages => {
        const pokemonRequests: Observable<any>[] = [];
        const uniquePokemonNames: Set<string> = new Set();

        pages.forEach((page: any) => {
          page.results.forEach((pokemon: any) => {
            const baseName = pokemon.name.split('-')[0];
            if (!uniquePokemonNames.has(baseName)) {
              uniquePokemonNames.add(baseName);
              pokemonRequests.push(this.http.get<any>(pokemon.url).pipe(
                switchMap(details => {
                  const typeRequests: Observable<string>[] = details.types.map((slot: any) =>
                    this.http.get<any>(slot.type.url).pipe(
                      map(typeDetails => typeDetails.name),
                      catchError(error => {
                        console.error('Error fetching type:', slot.type.name, error);
                        return of('');
                      })
                    )
                  );

                  return forkJoin(typeRequests).pipe(
                    map(types => ({
                      name: baseName,
                      spriteUrl: details.sprites.front_default,
                      types: types
                    })),
                    catchError(error => {
                      console.error('Error fetching types for:', pokemon.name, error);
                      return of({ name: baseName, spriteUrl: '', types: [] });
                    })
                  );
                }),
                catchError(error => {
                  console.error('Error fetching details for:', pokemon.name, error);
                  return of({ name: baseName, spriteUrl: '', types: [] });
                })
              ));
            }
          });
        });

        return forkJoin(pokemonRequests);
      })
    ).subscribe(pokemonDetails => {
      this.pokemonList = pokemonDetails;
      this.loading = false; // Cambiar la bandera de carga a false cuando se complete la obtención de datos
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
