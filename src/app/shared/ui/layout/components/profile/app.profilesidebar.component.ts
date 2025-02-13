import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AppLayoutStore} from '../../service/app.layout.store';
import {Drawer} from 'primeng/drawer';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';

@Component({
    selector: 'app-profilemenu',
    templateUrl: './app.profilesidebar.component.html',
    styleUrls: ['./app.profilesidebar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Drawer, ButtonDirective, Ripple]
})
export class AppProfileSidebarComponent {

    private profileSidebarVisible$ = this.store.profileSidebarVisible$;

    constructor(public store: AppLayoutStore) {
    }

    get visible(): boolean {
        return this.profileSidebarVisible$();
    }

    set visible(visibility: boolean) {
        this.store.updateProfileSidebarVisible(visibility)
    }
}
