import {Component, input} from '@angular/core';

@Component({
    selector: 'app-no-content',
    imports: [],
    templateUrl: './no-content.component.html',
    styleUrl: './no-content.component.scss'
})
export class NoContentComponent {
  content = input.required<string>();
  icon = input<string | undefined>();
  styles = input<string | undefined>();
}
