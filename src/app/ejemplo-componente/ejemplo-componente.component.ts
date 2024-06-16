import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Módulo de Angular que permitir la navegación 
                                          // entre diferentes vistas o componentes.
@Component({
  selector: 'app-ejemplo-componente',
  templateUrl: './ejemplo-componente.component.html',
  styleUrls: ['./ejemplo-componente.component.css']
})
export class EjemploComponenteComponent {
  constructor(private router: Router) { }

  irAlComponente2() {
    this.router.navigate(['/ejemplo-componente2']);
  }
}
