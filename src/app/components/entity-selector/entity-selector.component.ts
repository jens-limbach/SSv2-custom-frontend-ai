import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface SelectableEntity {
  id: string;
  displayName: string;
  displayId?: string;
}

@Component({
  selector: 'app-entity-selector',
  templateUrl: './entity-selector.component.html',
  styleUrl: './entity-selector.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule]
})
export class EntitySelectorComponent {
  readonly label = input.required<string>();
  readonly placeholder = input<string>('Search...');
  readonly entities = input.required<SelectableEntity[]>();
  readonly selectedId = input<string | null>(null);
  readonly required = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  readonly entitySelected = output<string>();

  protected readonly searchTerm = signal('');
  protected readonly isOpen = signal(false);
  protected readonly focusedIndex = signal(-1);

  protected readonly selectedEntity = computed(() => {
    const id = this.selectedId();
    if (!id) return null;
    return this.entities().find(e => e.id === id) || null;
  });

  protected readonly filteredEntities = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.entities();
    
    return this.entities().filter(entity =>
      entity.displayName.toLowerCase().includes(term) ||
      entity.displayId?.toLowerCase().includes(term)
    );
  });

  protected readonly displayValue = computed(() => {
    const selected = this.selectedEntity();
    if (!selected) return '';
    return selected.displayId 
      ? `${selected.displayName} (${selected.displayId})`
      : selected.displayName;
  });

  protected onInputFocus() {
    this.isOpen.set(true);
    this.focusedIndex.set(-1);
  }

  protected onInputBlur() {
    // Delay to allow click on dropdown items
    setTimeout(() => {
      this.isOpen.set(false);
      // Reset search if nothing selected
      if (!this.selectedId()) {
        this.searchTerm.set('');
      }
    }, 200);
  }

  protected onInputChange(value: string) {
    this.searchTerm.set(value);
    this.isOpen.set(true);
    this.focusedIndex.set(-1);
  }

  protected selectEntity(entity: SelectableEntity) {
    this.entitySelected.emit(entity.id);
    this.searchTerm.set('');
    this.isOpen.set(false);
    this.focusedIndex.set(-1);
  }

  protected clearSelection() {
    this.entitySelected.emit('');
    this.searchTerm.set('');
    this.focusedIndex.set(-1);
  }

  protected onKeyDown(event: KeyboardEvent) {
    const filtered = this.filteredEntities();
    const currentIndex = this.focusedIndex();

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.isOpen.set(true);
      this.focusedIndex.set(Math.min(currentIndex + 1, filtered.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.focusedIndex.set(Math.max(currentIndex - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (currentIndex >= 0 && currentIndex < filtered.length) {
        this.selectEntity(filtered[currentIndex]);
      }
    } else if (event.key === 'Escape') {
      this.isOpen.set(false);
      this.focusedIndex.set(-1);
    }
  }
}
