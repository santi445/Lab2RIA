import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http'; //  Módulo que permite realizar solicitudes HTTP 
                                                  //  (como GET, POST, PUT, DELETE, etc.) 
                                                  //   a servidores remotos 
import { Router, ActivatedRoute } from '@angular/router'
@Component({
  selector: 'app-ejemplo-componente2',
  templateUrl: './ejemplo-componente2.component.html',
  styleUrls: ['./ejemplo-componente2.component.css']
})
export class EjemploComponente2 {

  pokemonList: string[] = []; // Variable para almacenar los nombres de los Pokémon
  page: number = 1;
  
  ngOnInit(): void {
    this.listarPokemons();
  }

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) { }

  listarPokemons(endpoint = 'https://pokeapi.co/api/v2/pokemon', offset = 0, limit = 20) {
    this.http.get<any>(endpoint + '?offset=' + offset + '&limit=' + limit)
        .subscribe(response => {
            if (response.results.length === 0) {
                // No more results, stop recursion
                console.log('All Pokémon listed:', this.pokemonList);
                return;
            }

            // Concatenate new pokemon names to the list
            this.pokemonList = this.pokemonList.concat(response.results.map((pokemon: any) => pokemon.name));

            // Call recursively with updated offset
            this.listarPokemons(endpoint, offset + limit, limit);
        });
  }

  detallesPokemon(nombre: string){
    this.router.navigate(['nuevo-componente',nombre]);
  }
}
