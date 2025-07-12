import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

import {AppMenuitemComponent} from './menuitem/app.menuitem.component';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
  styleUrls: ['./app.menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppMenuitemComponent],
  standalone: true
})
export class AppMenuComponent implements OnInit {
  /* eslint-disable */
  model: any[] = [];

  ngOnInit() {
    this.model = [
      {
        label: 'Start',
        icon: 'pi pi-home',
        items: [
          {
            label: 'Home',
            icon: 'pi pi-fw pi-home',
            routerLink: ['/']
          }
        ]
      },
      {
        label: 'State Management',
        icon: 'pi-objects-column',
        items: [
          {
            label: 'Todo list',
            icon: 'pi pi-fw pi-list',
            routerLink: ['/todo']
          }
        ]
      },
      {
        label: 'Change Detection',
        icon: 'pi-objects-column',
        items: [
          {
            label: 'Default',
            icon: 'pi pi-fw pi-list',
            routerLink: ['/examples/change/detection/default']
          },
          {
            label: 'On-Push',
            icon: 'pi pi-fw pi-list',
            routerLink: ['/examples/change/detection/onpush']
          },
          {
            label: 'On-Push Signals',
            icon: 'pi pi-fw pi-list',
            routerLink: ['/examples/change/detection/signal']
          },
          {
            label: 'On-Push RxJS',
            icon: 'pi pi-fw pi-list',
            routerLink: ['/examples/change/detection/rxjs']
          }
        ]
      },
      {
        label: 'Reactive Programming',
        icon: 'pi-objects-column',
        items: [
          {
            label: 'Combine Latest',
            icon: 'pi pi-fw pi-list',
            routerLink: ['/examples/rxjs/combine-latest']
          },
          {
            label: 'Fork Join',
            icon: 'pi pi-fw pi-list',
            routerLink: ['/examples/rxjs/fork-join']
          },
          {
            label: 'Zip',
            icon: 'pi pi-fw pi-list',
            routerLink: ['/examples/rxjs/zip']
          }
        ]
      },
      {
        label: 'Clocking',
        icon: 'pi-clock',
        items: [
          {
            label: 'Tracking',
            icon: 'pi pi-fw pi-calendar-clock',
            routerLink: ['/clocking/employee/tracking']
          },
          {
            label: 'Approve',
            icon: 'pi pi-fw pi-calendar-clock',
            routerLink: ['/clocking/admin/approve']
          }
        ]
      },
      {
        label: 'Process',
        icon: 'pi pi-cog',
        items: [
          {
            label: 'Modeller',
            icon: 'pi pi-fw pi-sitemap',
            routerLink: ['/process/editor']
          }
        ]
      }
    ];
  }
}
