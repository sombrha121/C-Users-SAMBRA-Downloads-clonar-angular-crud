import { Component, OnInit } from '@angular/core'; // Importa las clases y módulos necesarios de Angular
import { ActivatedRoute } from '@angular/router'; // Para obtener información sobre la ruta activa
import { Router } from '@angular/router'; // Para navegar entre rutas
import { FlightService } from '../flight.service'; // Importa un servicio para gestionar vuelos
import { Flight } from '../flight'; // Importa la clase Flight
import { map, switchMap } from 'rxjs/operators'; // Importa operadores de RxJS
import { of } from 'rxjs'; // Importa la función 'of' de RxJS

@Component({
  selector: 'app-flight-edit', // Selector del componente
  templateUrl: './flight-edit.component.html' // Ruta de la plantilla HTML asociada al componente
})
export class FlightEditComponent implements OnInit { // Definición del componente y su implementación de OnInit

  id!: string; // Almacena el identificador del vuelo
  flight!: Flight; // Almacena información sobre el vuelo actual
  feedback: any = {}; // Se utiliza para proporcionar retroalimentación al usuario

  constructor(
    private route: ActivatedRoute, // Inyección del servicio ActivatedRoute
    private router: Router, // Inyección del servicio Router
    private flightService: FlightService // Inyección de un servicio personalizado para gestionar vuelos
  ) {}

  ngOnInit() { // Método que se ejecuta al iniciar el componente
    this
      .route
      .params
      .pipe(
        map(p => p.id), // Extrae el ID de los parámetros de la ruta
        switchMap(id => {
          if (id === 'new') { return of(new Flight()); } // Si el ID es 'new', crea un nuevo objeto Flight
          return this.flightService.findById(id); // Si es un ID válido, obtiene detalles del vuelo a través del servicio
        })
      )
      .subscribe(flight => { // Suscribe a la respuesta de la operación anterior
          this.flight = flight; // Almacena la información del vuelo
          this.feedback = {}; // Limpia cualquier mensaje de retroalimentación
        },
        err => {
          this.feedback = {type: 'warning', message: 'Error loading'}; // En caso de error, muestra un mensaje de advertencia
        }
      );
  }

  save() { // Método para guardar los cambios en la información del vuelo
    this.flightService.save(this.flight).subscribe( // Utiliza el servicio para guardar el vuelo
      flight => {
        this.flight = flight; // Almacena los cambios realizados en el vuelo
        this.feedback = {type: 'success', message: 'Save was successful!'}; // Muestra un mensaje de éxito
        setTimeout(() => {
          this.router.navigate(['/flights']); // Redirige al usuario a la lista de vuelos después de un breve retraso
        }, 1000);
      },
      err => {
        this.feedback = {type: 'warning', message: 'Error saving'}; // En caso de error al guardar, muestra un mensaje de advertencia
      }
    );
  }

  cancel() { // Método para cancelar la edición
    this.router.navigate(['/flights']); // Redirige al usuario de vuelta a la lista de vuelos
  }
}
