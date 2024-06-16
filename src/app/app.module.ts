import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Importa HttpClientModule
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EjemploComponenteComponent } from './ejemplo-componente/ejemplo-componente.component';
import { EjemploComponente2 } from './ejemplo-componente2/ejemplo-componente2.component';
import { NuevoComponenteComponent } from './nuevo-componente/nuevo-componente.component';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    AppComponent,
    EjemploComponenteComponent,
    EjemploComponente2,
    NuevoComponenteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
