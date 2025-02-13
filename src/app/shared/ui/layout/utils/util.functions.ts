/**
 * Checks if the current device is considered a desktop based on window width.
 * @returns {boolean} `true` if the window width is greater than 991 pixels, otherwise `false`.
 */
export const isDesktop = (): boolean => window.innerWidth > 991;

/**
 * Checks if the current device is considered a mobile device.
 * This is determined by negating the result of `isDesktop`.
 * @returns {boolean} `true` if the window width is 991 pixels or less, otherwise `false`.
 */
export const isMobile = (): boolean => !isDesktop();