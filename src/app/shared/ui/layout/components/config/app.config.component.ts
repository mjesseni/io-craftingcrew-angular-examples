import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {AppLayoutStore} from '../../service/app.layout.store';
import {COLOR_THEMES, ColorScheme, MenuMode, TopbarColorScheme} from '../../service/app.layout.state';
import {Drawer} from 'primeng/drawer';
import {RadioButton} from 'primeng/radiobutton';
import {FormsModule} from '@angular/forms';
import {NgFor, NgStyle, NgIf, NgClass} from '@angular/common';
import {ButtonDirective} from 'primeng/button';
import {InputSwitch} from 'primeng/inputswitch';

@Component({
    selector: 'app-config',
    templateUrl: './app.config.component.html',
    styleUrls: ['./app.config.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Drawer, RadioButton, FormsModule, NgFor, NgStyle, NgIf, ButtonDirective, NgClass, InputSwitch]
})
export class AppConfigComponent {
    @Input() minimal = false;

    protected componentThemes = COLOR_THEMES;
    protected scales: number[] = [12, 13, 14, 15, 16];

    protected configSidebarVisible$ = this.store.configSidebarVisible$;
    protected scale$ = this.store.scale$;
    protected menuMode$ = this.store.menuMode$;
    protected colorScheme$ = this.store.colorScheme$;
    protected inputStyle$ = this.store.inputStyle$;
    protected ripple$ = this.store.ripple$;
    protected theme$ = this.store.theme$;
    protected menuTheme$ = this.store.menuTheme$; // NEED ONLY THIS SIGNAL FOR FURTHER USAGE
    protected topbarTheme$ = this.store.topbarTheme$;
    protected horizontal$ = this.store.horizontal$;

    constructor(protected store: AppLayoutStore) {
    }

    protected get visible(): boolean {
        return this.configSidebarVisible$();
    }

    protected set visible(visibility: boolean) {
        this.store.updateConfigSidebarVisibility(visibility);
    }

    protected get scale(): number {
        return this.scale$();
    }

    protected set scale(scale: number) {
        this.store.updateScale(scale);
    }

    protected get menuMode(): MenuMode {
        return this.menuMode$();
    }

    protected set menuMode(mode: MenuMode) {
        this.store.updateMenuMode(mode);
    }

    protected get colorScheme(): ColorScheme {
        return this.colorScheme$();
    }

    protected set colorScheme(scheme: ColorScheme) {
        this.store.updateColorScheme(scheme);
    }

    protected get inputStyle(): string {
        return this.inputStyle$();
    }

    protected set inputStyle(style: string) {
        this.store.updateInputStyle(style);
    }

    protected get ripple(): boolean {
        return this.ripple$();
    }

    protected set ripple(ripple: boolean) {
        this.store.updateRipple(ripple);
    }

    protected get menuTheme(): ColorScheme {
        return this.menuTheme$();
    }

    protected set menuTheme(theme: ColorScheme) {
        this.store.updateMenuTheme(theme);
    }

    protected get topbarTheme(): TopbarColorScheme {
        return this.topbarTheme$();
    }

    protected set topbarTheme(theme: TopbarColorScheme) {
        this.store.updateTopbarTheme(theme);
    }

    protected set theme(theme: string) {
        this.store.updateTheme(theme);
    }

    protected onConfigButtonClick() {
        this.visible = !this.visible;
    }

    protected changeTheme(theme: string) {
        this.theme = theme;
    }

    protected decrementScale() {
        this.scale--;
    }

    protected incrementScale() {
        this.scale++;
    }
}
