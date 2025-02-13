import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {NgFor, NgIf} from '@angular/common';
import {AppMenuitemComponent} from './menuitem/app.menuitem.component';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
  styleUrls: ['./app.menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgFor, NgIf, AppMenuitemComponent]
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
      }
    ];
  }
}
