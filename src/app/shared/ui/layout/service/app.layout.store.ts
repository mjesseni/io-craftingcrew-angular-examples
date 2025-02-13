import {Injectable} from '@angular/core';
import {ComponentStore} from '@ngrx/component-store';
import {AppLayoutState, ColorScheme, initialLayoutState, MenuMode, TopbarColorScheme} from './app.layout.state';
import {MenuService} from './app.menu.service';
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AppLayoutStore extends ComponentStore<AppLayoutState> {

  // Selectors for layout state properties
  configSidebarVisible$ = this.selectSignal(state => state.configSidebarVisible);
  profileSidebarVisible$ = this.selectSignal(state => state.profileSidebarVisible);
  overlayMenuActive$ = this.selectSignal(state => state.overlayMenuActive);
  staticMenuMobileActive$ = this.selectSignal(state => state.staticMenuMobileActive);
  staticMenuDesktopInactive$ = this.selectSignal(state => state.staticMenuDesktopInactive);
  anchored$ = this.selectSignal(state => state.anchored);
  menuHoverActive$ = this.selectSignal(state => state.menuHoverActive);

  // Configuration selectors
  scale$ = this.selectSignal(state => state.config.scale);
  ripple$ = this.selectSignal(state => state.config.ripple);
  menuMode$ = this.selectSignal(state => state.config.menuMode);
  colorScheme$ = this.selectSignal(state => state.config.colorScheme);
  theme$ = this.selectSignal(state => state.config.theme);
  menuTheme$ = this.selectSignal(state => state.config.menuTheme);
  inputStyle$ = this.selectSignal(state => state.config.inputStyle);
  topbarTheme$ = this.selectSignal(state => state.config.topbarTheme);
  horizontal$ = this.selectSignal(state => this.isHorizontal(state.config.menuMode));
  overlay$ = this.selectSignal(state => this.isOverlay(state.config.menuMode));
  slim$ = this.selectSignal(state => this.isSlim(state.config.menuMode));
  slimPlus$ = this.selectSignal(state => this.isSlimPlus(state.config.menuMode));

  // Production
  production$ = this.selectSignal(_ => environment.production);

  // Overlay state for specific components
  overlayOpen$ = this.select(state => state.staticMenuMobileActive);
  private menuModeObs$ = this.select(state => state.config.menuMode);

  constructor(menuService: MenuService) {
    super(initialLayoutState);  // Initialize store with the initial state

    // Reset menu items when the menu mode changes to specific types
    this.menuModeObs$.subscribe(mode => {
      if (this.isSlimPlus(mode) || this.isSlim(mode) || this.isHorizontal(mode)) {
        menuService.reset();
      }
    });
  }

  /**
   * Hides the menu by updating related state properties.
   */
  readonly hideMenu = this.updater((state) => {
    return {
      ...state,
      overlayMenuActive: false,
      staticMenuMobileActive: false,
      menuHoverActive: false
    };
  });

  /**
   * Sets the visibility of the configuration sidebar.
   * @param visibility - The desired visibility state of the config sidebar
   */
  readonly updateConfigSidebarVisibility = this.updater((state, visibility: boolean) => {
    if (state.configSidebarVisible !== visibility) {
      return {
        ...state,
        configSidebarVisible: visibility
      };
    }
    return state;
  });

  /**
   * Sets the visibility of the profile sidebar.
   * @param visibility - The desired visibility state of the profile sidebar
   */
  readonly updateProfileSidebarVisible = this.updater((state, visibility: boolean) => {
    if (state.profileSidebarVisible !== visibility) {
      return {
        ...state,
        profileSidebarVisible: visibility
      };
    }
    return state;
  });

  /**
   * Sets the active state of the overlay menu.
   * @param active - Whether the overlay menu should be active
   */
  readonly updateOverlayMenuActive = this.updater((state, active: boolean) => {
    if (state.overlayMenuActive !== active) {
      return {
        ...state,
        overlayMenuActive: active
      };
    }
    return state;
  });

  /**
   * Sets the active state of the menu hover effect.
   * @param active - Whether the menu hover effect should be active
   */
  readonly updateMenuHoverActive = this.updater((state, active: boolean) => {
    if (state.menuHoverActive !== active) {
      return {
        ...state,
        menuHoverActive: active
      };
    }
    return state;
  });

  /**
   * Sets the inactive state of the static desktop menu.
   * @param inactive - Whether the static desktop menu should be inactive
   */
  readonly updateStaticMenuDesktopInactive = this.updater((state, inactive: boolean) => {
    if (state.staticMenuDesktopInactive !== inactive) {
      return {
        ...state,
        staticMenuDesktopInactive: inactive
      };
    }
    return state;
  });

  /**
   * Sets the active state of the static mobile menu.
   * @param active - Whether the static mobile menu should be active
   */
  readonly updateStaticMenuMobileActive = this.updater((state, active: boolean) => {
    if (state.staticMenuMobileActive !== active) {
      return {
        ...state,
        staticMenuMobileActive: active
      };
    }
    return state;
  });

  /**
   * Sets the active state of the sidebar.
   * @param active - Whether the sidebar should be active
   */
  readonly updateSidebarActive = this.updater((state, active: boolean) => {
    if (state.sidebarActive !== active) {
      const updatedState = {
        ...state,
        sidebarActive: active
      };
      this.logStateChange('Update Sidebar Active', updatedState);
      return updatedState;
    }
    return state;
  });

  /**
   * Sets the anchored state of the sidebar.
   * @param anchored - Whether the sidebar should be anchored
   */
  readonly updateAnchored = this.updater((state, anchored: boolean) => {
    if (state.anchored !== anchored) {
      return {
        ...state,
        anchored: anchored
      };
    }
    return state;
  });

  /**
   * Sets a new input style in the configuration.
   * @param style - The desired input style
   */
  readonly updateInputStyle = this.updater((state, style: string) => {
    if (state.config.inputStyle !== style) {
      return {
        ...state,
        config: {...state.config, inputStyle: style}
      };
    }
    return state;
  });

  /**
   * Sets a new color scheme in the configuration.
   * @param theme - The desired color scheme
   */
  readonly updateColorScheme = this.updater((state, theme: ColorScheme) => {
    if (state.config.colorScheme !== theme) {
      return {
        ...state,
        config: {
          ...state.config,
          colorScheme: theme,
          menuTheme: theme,
          topbarTheme: state.config.topbarTheme === 'transparent' ? state.config.topbarTheme : theme
        }
      };
    }
    return state;
  });

  /**
   * Sets a new menu mode in the configuration.
   * @param mode - The desired menu mode
   */
  readonly updateMenuMode = this.updater((state, mode: MenuMode) => {
    if (state.config.menuMode !== mode) {
      const menuTheme = this.isHorizontal(mode) && state.config.topbarTheme === 'transparent'
        ? state.config.menuTheme : state.config.topbarTheme;

      const updatedState = {
        ...state,
        config: {
          ...state.config,
          menuMode: mode,
          menuTheme: menuTheme
        }
      };
      this.logStateChange('Update menu mode', updatedState);
      return updatedState;
    }
    return state;
  });

  /**
   * Sets a new theme for the menu.
   * @param colorScheme - The desired menu theme
   */
  readonly updateMenuTheme = this.updater((state, colorScheme: ColorScheme) => {
    if (this.isHorizontal(this.menuMode$())) {
      const theme: ColorScheme = this.topbarTheme$() === 'transparent' ? this.menuTheme$() : colorScheme;
      if (theme !== this.menuTheme$()) {
        return {...state, config: {...state.config, menuTheme: theme}};
      }
    } else {
      return {...state, config: {...state.config, menuTheme: colorScheme}};
    }
    return state;
  });

  /**
   * Sets a new theme for the topbar.
   * @param colorScheme - The desired topbar theme
   */
  readonly updateTopbarTheme = this.updater((state, colorScheme: TopbarColorScheme) => {
    if (this.isHorizontal(this.menuMode$())) {
      const theme: ColorScheme = this.menuTheme$() === 'transparent' ? this.colorScheme$() : colorScheme;
      if (theme !== this.menuTheme$()) {
        return {...state, config: {...state.config, topbarTheme: theme}};
      }
    } else {
      return {...state, config: {...state.config, topbarTheme: colorScheme}};
    }
    return state;
  });

  /**
   * Sets a new scale in the configuration.
   * @param scale - The desired scale value
   */
  readonly updateScale = this.updater((state, scale: number) => {
    if (state.config.scale !== scale) {
      return {
        ...state,
        config: {...state.config, scale: scale}
      };
    }
    return state;
  });

  /**
   * Enables or disables the ripple effect.
   * @param ripple - Whether to enable the ripple effect
   */
  readonly updateRipple = this.updater((state, ripple: boolean) => {
    if (state.config.ripple !== ripple) {
      return {
        ...state,
        config: {...state.config, ripple: ripple}
      };
    }
    return state;
  });

  /**
   * Sets a new theme in the configuration.
   * @param theme - The desired theme
   */
  readonly updateTheme = this.updater((state, theme: string) => {
    if (state.config.theme !== theme) {
      return {
        ...state,
        config: {...state.config, theme: theme}
      };
    }
    return state;
  });

  // Utility functions to check menu mode type
  private isSlim(mode: MenuMode) {
    return mode === 'slim';
  }

  private isSlimPlus(mode: MenuMode) {
    return mode === 'slim-plus';
  }

  private isHorizontal(mode: MenuMode) {
    return mode === 'horizontal';
  }

  private isOverlay(mode: MenuMode) {
    return mode === 'overlay';
  }

  // Log state changes to DevTools
  private logStateChange(action: string, newState: AppLayoutState) {
    if (!this.production$()) {
      (window as any).__REDUX_DEVTOOLS_EXTENSION__?.send(
        { type: `[LayoutStore] ${action}` },
        newState
      );
    }
  }
}
