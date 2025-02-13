import {ChangeDetectionStrategy, Component, ElementRef, HostListener, signal, ViewChild} from '@angular/core';
import {AppSidebarComponent} from '../sidebar/app.sidebar.component';
import {LayoutService} from '../../service/app.layout.service';
import {AppLayoutStore} from "../../service/app.layout.store";
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {InputText} from 'primeng/inputtext';
import {StyleClass} from 'primeng/styleclass';
import {Ripple} from 'primeng/ripple';
import {ButtonDirective} from 'primeng/button';
import {Tooltip} from 'primeng/tooltip';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styleUrls: ['./app.topbar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AppSidebarComponent, IconField, InputIcon, InputText, StyleClass, Ripple, ButtonDirective, Tooltip]
})
export class AppTopbarComponent {
    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;

    @ViewChild('searchMenu') searchMenu!: ElementRef;
    @ViewChild('searchToggle') searchToggle!: ElementRef;
    isMenuHidden = true;

    protected colorScheme$ = this.store.colorScheme$;
    lightMode = signal<boolean>(true);
    staticMenuDesktopInactive = this.store.staticMenuDesktopInactive$;

    constructor(public layoutService: LayoutService, public el: ElementRef, private store: AppLayoutStore) {
        const storedValue = localStorage.getItem('theme');
        if (storedValue !== null) {
            this.lightMode.set(JSON.parse(storedValue) === 'light');
            const root = document.querySelector('html'); // Or 'body'
            this.store.updateColorScheme(JSON.parse(storedValue));
            root?.classList.toggle(JSON.parse(storedValue));
        } else {
            localStorage.setItem('theme', JSON.stringify("light"));
            this.store.updateColorScheme("light");
        }
    }

    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    onSidebarButtonClick() {
        this.layoutService.showSidebar();
    }

    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }

    toggleDarkMode() {
        this.lightMode.set(!this.lightMode());
        localStorage.setItem('theme', JSON.stringify(this.lightMode() ? 'light' : 'dark'));
        const root = document.querySelector('html'); // Or 'body'
        root?.classList.toggle('dark');
    }

    toggleThemeMode() {
        // this.store.updateColorScheme(this.lightMode ? 'light' : 'dark');
    }

    toggleSearchMenu() {
        this.isMenuHidden = !this.isMenuHidden;
    }

    @HostListener('document:click', ['$event'])
    closeMenuOnOutsideClick(event: Event) {
        if (
            !this.searchToggle?.nativeElement.contains(event.target) &&
            !this.searchMenu?.nativeElement.contains(event.target)
        ) {
            this.isMenuHidden = true;
        }
    }
}
