import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SamplesListComponent } from './components/samples-list/samples-list.component';

@Component({
  selector: 'app-root',
  template: '<app-samples-list />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SamplesListComponent]
})
export class AppComponent {}
