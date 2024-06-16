import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EjemploComponenteComponent } from './ejemplo-componente/ejemplo-componente.component';
import { EjemploComponente2 } from './ejemplo-componente2/ejemplo-componente2.component';
import { NuevoComponenteComponent } from './nuevo-componente/nuevo-componente.component';

const routes: Routes = [
  { path: 'ejemplo-componente', component : EjemploComponenteComponent},
  { path: 'ejemplo-componente2', component : EjemploComponente2},
  {path: 'nuevo-componente/:nombrePokemon', component: NuevoComponenteComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
  
})
export class AppRoutingModule { }
