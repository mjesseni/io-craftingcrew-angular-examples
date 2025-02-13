/**
 * Represents the initial layout state configuration for the app.
 * Contains configuration for themes, menus, and sidebar visibility.
 */
export const initialLayoutState: AppLayoutState = {
  config: {
    ripple: true,
    inputStyle: 'outlined',
    menuMode: 'static',
    colorScheme: 'light',
    theme: 'blue',
    scale: 12,
    menuTheme: 'light',
    topbarTheme: 'transparent',
  },
  staticMenuDesktopInactive: false,
  overlayMenuActive: false,
  profileSidebarVisible: false,
  configSidebarVisible: false,
  staticMenuMobileActive: false,
  menuHoverActive: false,
  sidebarActive: false,
  topbarMenuActive: false,
  anchored: false
};

/**
 * Defines the menu display modes available in the application.
 */
export type MenuMode = 'static' | 'overlay' | 'horizontal' | 'slim' | 'slim-plus' | 'reveal' | 'drawer';

/**
 * Defines the color schemes available for the application.
 * Can be a predefined option ('light' | 'dark') or a custom color string.
 */
export type ColorScheme = string | 'light' | 'dark';

/**
 * Defines the color schemes available for the topbar.
 * Can be a predefined option ('light' | 'dark' | 'transparent') or a custom color string.
 */
export type TopbarColorScheme = string | 'light' | 'dark' | 'transparent';

/**
 * Predefined color themes for the application.
 * Each color theme has a name and a corresponding color value.
 */
export const COLOR_THEMES: ColorMapping[] = [
  {name: 'avocado', color: '#AEC523'},
  {name: 'blue', color: '#5297FF'},
  {name: 'purple', color: '#464DF2'},
  {name: 'teal', color: '#14B8A6'},
  {name: 'green', color: '#34B56F'},
  {name: 'indigo', color: '#6366F1'},
  {name: 'orange', color: '#FF810E'},
  {name: 'red', color: '#FF9B7B'},
  {name: 'turquoise', color: '#58AED3'},
  {name: 'yellow', color: '#FFB340'},
];

/**
 * Interface representing a color mapping.
 * Used to define color themes with a name and corresponding hex color code.
 */
export interface ColorMapping {
  /** The name of the color theme */
  name: string;

  /** The hex color code for the theme */
  color: string;
}

/**
 * Interface representing the app's configuration options.
 */
export interface AppConfig {
  /** Style for form inputs, such as 'outlined' or 'filled' */
  inputStyle: string;

  /** The overall color scheme of the application (light or dark mode) */
  colorScheme: ColorScheme;

  /** The selected theme for the application */
  theme: string;

  /** Flag to enable or disable ripple effect on elements */
  ripple: boolean;

  /** The menu mode setting (e.g., static or overlay) */
  menuMode: MenuMode;

  /** Scale factor for UI elements */
  scale: number;

  /** The theme for the menu (light or dark) */
  menuTheme: ColorScheme;

  /** The theme for the topbar (light, dark, or transparent) */
  topbarTheme: TopbarColorScheme;
}

/**
 * Interface representing the state of the app layout.
 */
export interface AppLayoutState {
  /** Application configuration options */
  config: AppConfig;

  /** Indicates if the static menu is inactive on desktops */
  staticMenuDesktopInactive: boolean;

  /** Indicates if the overlay menu is currently active */
  overlayMenuActive: boolean;

  /** Controls the visibility of the profile sidebar */
  profileSidebarVisible: boolean;

  /** Controls the visibility of the configuration sidebar */
  configSidebarVisible: boolean;

  /** Indicates if the static menu is active on mobile devices */
  staticMenuMobileActive: boolean;

  /** Indicates if the menu is in hover mode */
  menuHoverActive: boolean;

  /** Controls the visibility of the sidebar */
  sidebarActive: boolean;

  /** Controls the visibility of the topbar menu */
  topbarMenuActive: boolean;

  /** Indicates if the sidebar is anchored */
  anchored: boolean;
}
