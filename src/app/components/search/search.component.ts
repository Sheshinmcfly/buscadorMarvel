import { Component, Input, Output, EventEmitter, inject, signal, OnChanges, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HeroService } from '../../services/hero.service';
import { Character, Publisher } from '../../models/character';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnChanges {
  @Input() publisher: Publisher = 'Marvel Comics';
  @Input() isDC = false;
  @Output() results = new EventEmitter<Character[]>();
  @Output() loadingChange = new EventEmitter<boolean>();

  private readonly fb = inject(FormBuilder);
  private readonly heroService = inject(HeroService);

  searched = signal(false);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isDC'] && !changes['isDC'].firstChange) {
      this.form.reset();
      this.searched.set(false);
    }
  }

  form = this.fb.group({
    query: ['', [Validators.required, Validators.minLength(2)]]
  });

  get query() { return this.form.get('query')!; }

  search(): void {
    if (this.form.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'Ingresa al menos 2 caracteres para buscar.',
        background: '#1a1a2e',
        color: '#f5f5f5',
        confirmButtonColor: this.isDC ? '#1a53a0' : '#B7000D'
      });
      return;
    }

    const name = this.query.value!.trim();
    this.loadingChange.emit(true);
    this.searched.set(true);

    this.heroService.search(name, this.publisher).subscribe({
      next: (chars) => {
        this.loadingChange.emit(false);
        if (chars.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'Sin resultados',
            text: `No se encontraron personajes de ${this.publisher} con el nombre "${name}".`,
            background: '#1a1a2e',
            color: '#f5f5f5',
            confirmButtonColor: this.isDC ? '#1a53a0' : '#B7000D'
          });
          this.results.emit([]);
        } else {
          this.results.emit(chars);
        }
      },
      error: () => {
        this.loadingChange.emit(false);
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'No se pudo conectar con la API. Intenta nuevamente.',
          background: '#1a1a2e',
          color: '#f5f5f5',
          confirmButtonColor: this.isDC ? '#1a53a0' : '#B7000D'
        });
      }
    });
  }

  clear(): void {
    this.form.reset();
    this.searched.set(false);
    this.results.emit([]);
  }
}
