import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EjemploComponente2 } from './ejemplo-componente2/ejemplo-componente2.component';
import { NuevoComponenteComponent } from './nuevo-componente/nuevo-componente.component';
import { TipoComponent } from './tipo/tipo.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';

const routes: Routes = [
  { path: 'ejemplo-componente2', component : EjemploComponente2},
  { path: 'nuevo-componente/:nombrePokemon', component: NuevoComponenteComponent},
  { path: 'tipo/:nombreTipo', component: TipoComponent},
  { path: 'estadisticas/:nombrePokemon', component: EstadisticasComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
  
})
export class AppRoutingModule { }
