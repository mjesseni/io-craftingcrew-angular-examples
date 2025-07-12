import {
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import {NavigationEnd, Router, RouterLinkActive, RouterLink} from '@angular/router';
import {animate, AnimationEvent, state, style, transition, trigger} from '@angular/animations';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';
import {DomHandler} from 'primeng/dom';
import {MenuService} from '../../../service/app.menu.service';
import {AppLayoutStore} from '../../../service/app.layout.store';
import {isDesktop, isMobile} from '../../../utils/util.functions';
import {LayoutService} from '../../../service/app.layout.service';
import { NgClass } from '@angular/common';
import {Ripple} from 'primeng/ripple';
import {Tooltip} from 'primeng/tooltip';
import {TranslocoPipe} from '@jsverse/transloco';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: '[app-menuitem]',
    templateUrl: './app.menuitem.component.html',
    styleUrls: ['./app.menuitem.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('children', [
            state('collapsed', style({
                height: '0'
            })),
            state('expanded', style({
                height: '*'
            })),
            state('hidden', style({
                display: 'none'
            })),
            state('visible', style({
                display: 'block'
            })),
            transition('collapsed <=> expanded', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ],
    imports: [Ripple, NgClass, Tooltip, RouterLinkActive, RouterLink, TranslocoPipe],
    standalone: true
})
export class AppMenuitemComponent implements OnInit, OnDestroy {
    /* eslint-disable */
    @Input() item: any;
    @Input() index!: number;
    @Input() @HostBinding('class.layout-root-menuitem') root!: boolean;
    @Input() parentKey!: string;
    @ViewChild('submenu') submenu!: ElementRef;

    active = false;
    menuSourceSubscription: Subscription;
    menuResetSubscription: Subscription;
    key = '';

    private menuHoverActive$ = this.store.menuHoverActive$;
    protected horizontal$ = this.store.horizontal$;
    protected slim$ = this.store.slim$;
    protected slimPlus$ = this.store.slimPlus$;
    protected horizontalOrSlim$ = computed(() => this.horizontal$() || this.slim$() || this.slimPlus$());

    constructor(public router: Router,
                private menuService: MenuService,
                private layoutService: LayoutService,
                private store: AppLayoutStore) {

        this.menuSourceSubscription = this.menuService.menuSource$.subscribe((value) => {
            Promise.resolve(null).then(() => {
                if (value.routeEvent) {
                    this.active = value.key === this.key || value.key.startsWith(this.key + '-');
                } else {
                    if (value.key !== this.key && !value.key.startsWith(this.key + '-')) {
                        this.active = false;
                    }
                }
            });
        });

        this.menuResetSubscription = this.menuService.resetSource$.subscribe(() => {
            this.active = false;
        });

        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
            if (this.horizontalOrSlim$()) {
                this.active = false;
            } else {
                if (this.item.routerLink) {
                    this.updateActiveStateFromRoute();
                }
            }
        });
    }

    ngOnInit() {
        this.key = this.parentKey ? this.parentKey + '-' + this.index : String(this.index);

        if (!(this.horizontalOrSlim$()) && this.item.routerLink) {
            this.updateActiveStateFromRoute();
        }
    }

    ngAfterViewChecked() {
        if (this.root && this.active && isDesktop() && (this.horizontalOrSlim$())) {
            this.calculatePosition(this.submenu?.nativeElement, this.submenu?.nativeElement.parentElement);
        }
    }

    updateActiveStateFromRoute() {
        const activeRoute = this.router.isActive(this.item.routerLink[0], {
            paths: 'exact',
            queryParams: 'ignored',
            matrixParams: 'ignored',
            fragment: 'ignored'
        });

        if (activeRoute) {
            this.menuService.onMenuStateChange({key: this.key, routeEvent: true});
        }
    }

    onSubmenuAnimated(event: AnimationEvent) {
        if (event.toState === 'visible' && isDesktop() && (this.horizontalOrSlim$())) {
            const el = event.element as HTMLUListElement;
            const elParent = el.parentElement as HTMLUListElement;
            this.calculatePosition(el, elParent);
        }
    }

    calculatePosition(overlay: HTMLElement, target: HTMLElement) {
        if (overlay) {
            const {left, top} = target.getBoundingClientRect();
            const [vWidth, vHeight] = [window.innerWidth, window.innerHeight];
            const [oWidth, oHeight] = [overlay.offsetWidth, overlay.offsetHeight];
            const scrollbarWidth = DomHandler.calculateScrollbarWidth();
            // reset
            overlay.style.top = '';
            overlay.style.left = '';

            if (this.horizontal$()) {
                const width = left + oWidth + scrollbarWidth;
                overlay.style.left = vWidth < width ? `${left - (width - vWidth)}px` : `${left}px`;
            } else if (this.slim$() || this.slimPlus$()) {
                const height = top + oHeight;
                overlay.style.top = vHeight < height ? `${top - (height - vHeight)}px` : `${top}px`;
                console.log('top', top, 'vHeight', vHeight, 'oHeight', oHeight, 'height', height);
            }
        }
    }

    itemClick(event: Event) {
        // avoid processing disabled items
        if (this.item.disabled) {
            event.preventDefault();
            return;
        }

        // navigate with hover
        if ((this.root && this.slim$()) || this.horizontal$() || this.slimPlus$()) {
            this.store.updateMenuHoverActive(!this.menuHoverActive$())
        }

        // execute command
        if (this.item.command) {
            this.item.command({originalEvent: event, item: this.item});
        }

        // toggle active state
        if (this.item.items) {
            this.active = !this.active;

            if (this.root && this.active && (this.horizontalOrSlim$())) {
                this.layoutService.onOverlaySubmenuOpen();
            }
        } else {
            if (isMobile()) {
                this.store.updateStaticMenuMobileActive(false);
            }

            if (this.horizontalOrSlim$()) {
                this.menuService.reset();
                this.store.updateMenuHoverActive(false);
            }
        }

        this.menuService.onMenuStateChange({key: this.key});
    }

    onMouseEnter() {
        // activate item on hover
        if (this.root && (this.horizontal$() || this.slim$() || this.slimPlus$()) && isDesktop()) {
            if (this.menuHoverActive$()) {
                this.active = true;
                this.menuService.onMenuStateChange({key: this.key});
            }
        }
    }

    get submenuAnimation() {
        if (isDesktop() && (this.horizontal$() || this.slim$() || this.slimPlus$())) return this.active ? 'visible' : 'hidden';
        else return this.root ? 'expanded' : this.active ? 'expanded' : 'collapsed';
    }

    @HostBinding('class.active-menuitem')
    get activeClass() {
        return this.active && !this.root;
    }

    ngOnDestroy() {
        if (this.menuSourceSubscription) {
            this.menuSourceSubscription.unsubscribe();
        }

        if (this.menuResetSubscription) {
            this.menuResetSubscription.unsubscribe();
        }
    }
}
