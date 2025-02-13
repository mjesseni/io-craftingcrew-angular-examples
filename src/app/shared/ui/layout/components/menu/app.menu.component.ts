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
                label: 'Dashboards',
                message: 'menu.dashboard.title',
                icon: 'pi pi-home',
                items: [
                    {
                        label: 'Home',
                        message: 'menu.dashboard.home.title',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/']
                    }
                ]
            },
            {
                label: 'Todo',
                message: 'menu.todo.title',
                icon: 'pi-objects-column',
                items: [
                    {
                        label: 'Todo list',
                        message: 'menu.todo.list.title',
                        icon: 'pi pi-fw pi-list',
                        routerLink: ['/todo']
                    }
                ]
            }
        ];
    }
}
