import { trigger, style, animate, transition, keyframes } from '@angular/animations';

// Define the fadeInOut animation as a pure function
export function fadeInOutAnimation() {
  return trigger('fadeInOut', [
    transition(':enter', [
      style({ opacity: 0 }), // Start with opacity 0
      animate('300ms ease-in', style({ opacity: 1 })) // Fade in to opacity 1
    ]),
    transition(':leave', [
      animate('300ms ease-out', style({ opacity: 0 })) // Fade out to opacity 0
    ])
  ]);
}

export function newTableRowAnimation() {
  return trigger('tableRowAnimation', [
    // New row with inner glow effect
    transition(':enter', [
      style({opacity: 0, transform: 'translateY(-10px)'}),
      animate(
        '1s ease-out',
        keyframes([
          style({
            opacity: 1,
            transform: 'translateY(0)',
            boxShadow: 'inset 0 0 10px 4px rgba(134, 197, 255, 0.6)',
            offset: 0
          }),
          style({boxShadow: 'inset 0 0 10px 4px rgba(134, 197, 255, 0)', offset: 1})
        ])
      )
    ]),
    // Inner glow effect for updated rows
    transition(':increment', [
      animate(
        '1s ease-in-out',
        keyframes([
          style({boxShadow: 'inset 0 0 10px 4px rgba(134, 197, 255, 0.6)', offset: 0}),
          style({boxShadow: 'inset 0 0 10px 4px rgba(134, 197, 255, 0)', offset: 1})
        ])
      )
    ])
  ]);
}
