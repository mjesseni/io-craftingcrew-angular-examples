import {ChangeDetectionStrategy, Component, ElementRef, ViewChild} from '@angular/core';
import {AppLayoutStore} from '../../service/app.layout.store';
import {RouterLink} from '@angular/router';
import {AppMenuComponent} from '../menu/app.menu.component';

@Component({
    selector: 'app-sidebar',
    templateUrl: './app.sidebar.component.html',
    styleUrls: ['./app.sidebar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, AppMenuComponent]
})
export class AppSidebarComponent {

    @ViewChild('menuContainer') menuContainer!: ElementRef;

    private anchored$ = this.store.anchored$;

    /* eslint-disable */
    private timeout: any = null;

    constructor(protected store: AppLayoutStore) {
    }

    onMouseEnter() {
        if (!this.anchored$()) {
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }
            this.store.updateSidebarActive(true);
        }
    }

    onMouseLeave() {
        if (!this.anchored$()) {
            if (!this.timeout) {
                this.timeout = setTimeout(() => (this.store.updateSidebarActive(false)), 300);
            }
        }
    }

    anchor() {
        this.store.updateAnchored(!this.anchored$());
    }
}
