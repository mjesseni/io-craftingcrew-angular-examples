import {ChangeDetectionStrategy, Component, computed, OnDestroy, Renderer2, ViewChild} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {filter} from 'rxjs';
import {AppSidebarComponent} from '../sidebar/app.sidebar.component';
import {AppTopbarComponent} from '../topbar/app.topbar.component';
import {MenuService} from '../../service/app.menu.service';
import {AppLayoutStore} from '../../service/app.layout.store';
import {AppLayoutState} from '../../service/app.layout.state';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {isDesktop} from '../../utils/util.functions';
import {NgClass} from '@angular/common';
import {AppBreadcrumbComponent} from '../breadcrumb/app.breadcrumb.component';
import {AppProfileSidebarComponent} from '../profile/app.profilesidebar.component';

@Component({
    selector: 'app-layout',
    templateUrl: './app.layout.component.html',
    styleUrls: ['./app.layout.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgClass, AppTopbarComponent, AppBreadcrumbComponent, RouterOutlet, AppProfileSidebarComponent]
})
export class AppLayoutComponent implements OnDestroy {
    /* eslint-disable */
    menuOutsideClickListener: any;
    /* eslint-disable */
    menuScrollListener: any;

    @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;
    @ViewChild(AppTopbarComponent) appTopbar!: AppTopbarComponent;

    protected containerClass$ = computed(() => this.getContainerClass(this.store.state()));
    protected overlayOpen$ = this.store.overlayOpen$;
    protected horizontal$ = this.store.horizontal$;
    protected slim$ = this.store.slim$;
    protected slimPlus$ = this.store.slimPlus$;
    protected staticMenuMobileActive$ = this.store.staticMenuMobileActive$;
    protected production$ = this.store.production$;

    constructor(private menuService: MenuService,
                private store: AppLayoutStore,
                public renderer: Renderer2,
                public router: Router) {

        this.overlayOpen$.pipe(takeUntilDestroyed()).subscribe(() => {
            if (!this.menuOutsideClickListener) {
                this.menuOutsideClickListener = this.renderer.listen(
                    'document', 'click',
                    (event) => {
                        const isOutsideClicked = !(
                            this.appTopbar.el.nativeElement.isSameNode(event.target) ||
                            this.appTopbar.el.nativeElement.contains(event.target) ||
                            this.appTopbar.menuButton.nativeElement.isSameNode(event.target) ||
                            this.appTopbar.menuButton.nativeElement.contains(event.target));
                        if (isOutsideClicked) {
                            this.hideMenu();
                        }
                    }
                );
            }

            if ((this.horizontal$() || this.slim$() || this.slimPlus$()) && !this.menuScrollListener) {
                this.menuScrollListener = this.renderer.listen(
                    this.appTopbar.appSidebar.menuContainer.nativeElement,
                    'scroll',
                    () => {
                        if (isDesktop()) {
                            this.hideMenu();
                        }
                    }
                );
            }

            if (this.staticMenuMobileActive$()) {
                this.blockBodyScroll();
            }
        });

        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => {
                this.hideMenu();
            });
    }

    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    }

    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(
                new RegExp(
                    '(^|\\b)' +
                    'blocked-scroll'.split(' ').join('|') +
                    '(\\b|$)',
                    'gi'
                ),
                ' '
            );
        }
    }

    hideMenu() {
        this.store.hideMenu();
        this.menuService.reset();
        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
            this.menuOutsideClickListener = null;
        }
        if (this.menuScrollListener) {
            this.menuScrollListener();
            this.menuScrollListener = null;
        }
        this.unblockBodyScroll();
    }

    private getContainerClass(state: AppLayoutState) {
        return {
            'layout-light': state.config.colorScheme === 'light',
            'layout-dark': state.config.colorScheme === 'dark',
            'layout-light-menu': state.config.menuTheme === 'light',
            'layout-dark-menu': state.config.menuTheme === 'dark',
            'layout-light-topbar': state.config.topbarTheme === 'light',
            'layout-dark-topbar': state.config.topbarTheme === 'dark',
            'layout-transparent-topbar': state.config.topbarTheme === 'transparent',
            'layout-overlay': state.config.menuMode === 'overlay',
            'layout-static': state.config.menuMode === 'static',
            'layout-slim': state.config.menuMode === 'slim',
            'layout-slim-plus': state.config.menuMode === 'slim-plus',
            'layout-horizontal': state.config.menuMode === 'horizontal',
            'layout-reveal': state.config.menuMode === 'reveal',
            'layout-drawer': state.config.menuMode === 'drawer',
            'layout-static-inactive': state.staticMenuDesktopInactive && state.config.menuMode === 'static',
            'layout-overlay-active': state.overlayMenuActive,
            'layout-mobile-active': state.staticMenuMobileActive,
            'p-input-filled': state.config.inputStyle === 'filled',
            'p-ripple-disabled': !state.config.ripple,
            'layout-sidebar-active': state.sidebarActive,
            'layout-sidebar-anchored': state.anchored,
        };
    }

    ngOnDestroy() {
        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
        }
    }
}
