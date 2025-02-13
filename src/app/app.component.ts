import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';

import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {BlockUIModule} from 'primeng/blockui';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ProgressSpinnerModule,
    BlockUIModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({opacity: 0}), // Start with opacity 0
        animate('500ms ease-in', style({opacity: 1})) // Fade in to opacity 1
      ]),
      transition(':leave', [
        animate('500ms ease-out', style({opacity: 0})) // Fade out to opacity 0
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'Smarter Software Angular Training';
}
