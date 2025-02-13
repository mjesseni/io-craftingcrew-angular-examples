import {effect, Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {AppLayoutStore} from './app.layout.store';
import {isDesktop} from '../utils/util.functions';

export interface MenuChangeEvent {
  key: string;
  routeEvent?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private overlayOpen = new Subject<boolean>();

  private scale$ = this.store.scale$;
  private overlayMenuActive$ = this.store.overlayMenuActive$;
  private staticMenuMobileActive$ = this.store.staticMenuMobileActive$;
  private staticMenuDesktopInactive$ = this.store.staticMenuDesktopInactive$;
  private overlay$ = this.store.overlay$;


  constructor(protected store: AppLayoutStore) {
    effect(() => {
      this.changeScale(this.scale$());
    });
  }

  changeScale(value: number) {
    document.documentElement.style.fontSize = `${value}px`;
  }

  onMenuToggle() {
    if (this.isOverlay()) {
      this.store.updateOverlayMenuActive(!this.overlayMenuActive$())
    }

    if (isDesktop()) {
      this.store.updateStaticMenuDesktopInactive(!this.staticMenuDesktopInactive$())
    } else {
      this.store.updateStaticMenuMobileActive(!this.staticMenuMobileActive$());
    }
  }

  onOverlaySubmenuOpen() {
    this.overlayOpen.next(true);
  }

  showSidebar() {
    this.store.updateProfileSidebarVisible(true);
  }

  showConfigSidebar() {
    this.store.updateConfigSidebarVisibility(true);
  }

  isOverlay() {
    return this.overlay$();
  }
}
