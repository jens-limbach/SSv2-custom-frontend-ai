import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface SelectOption {
  code: string;
  name: string;
}

@Component({
  selector: 'app-code-selector',
  templateUrl: './code-selector.component.html',
  styleUrl: './code-selector.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule]
})
export class CodeSelectorComponent {
  readonly label = input.required<string>();
  readonly placeholder = input<string>('Select...');
  readonly options = input.required<SelectOption[]>();
  readonly selectedCode = input<string | null>(null);
  readonly required = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  readonly codeSelected = output<string>();

  protected readonly searchTerm = signal('');
  protected readonly isOpen = signal(false);
  protected readonly focusedIndex = signal(-1);

  protected readonly selectedOption = computed(() => {
    const code = this.selectedCode();
    if (!code) return null;
    return this.options().find(o => o.code === code) || null;
  });

  protected readonly filteredOptions = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.options();
    
    return this.options().filter(option =>
      option.code.toLowerCase().includes(term) ||
      option.name.toLowerCase().includes(term)
    );
  });

  protected readonly displayValue = computed(() => {
    const selected = this.selectedOption();
    if (!selected) return '';
    return `${selected.code} - ${selected.name}`;
  });

  protected onInputFocus() {
    this.isOpen.set(true);
    this.focusedIndex.set(-1);
  }

  protected onInputBlur() {
    setTimeout(() => {
      this.isOpen.set(false);
      if (!this.selectedCode()) {
        this.searchTerm.set('');
      }
    }, 200);
  }

  protected onInputChange(value: string) {
    this.searchTerm.set(value);
    this.isOpen.set(true);
    this.focusedIndex.set(-1);
  }

  protected selectOption(option: SelectOption) {
    this.codeSelected.emit(option.code);
    this.searchTerm.set('');
    this.isOpen.set(false);
    this.focusedIndex.set(-1);
  }

  protected clearSelection() {
    this.codeSelected.emit('');
    this.searchTerm.set('');
    this.focusedIndex.set(-1);
  }

  protected onKeyDown(event: KeyboardEvent) {
    const filtered = this.filteredOptions();
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
        this.selectOption(filtered[currentIndex]);
      }
    } else if (event.key === 'Escape') {
      this.isOpen.set(false);
      this.focusedIndex.set(-1);
    }
  }
}
