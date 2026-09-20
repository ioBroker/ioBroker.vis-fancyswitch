/*
 * The widgets, imported in one place.
 *
 * They extend `window.visRxWidget`, so this module must only be evaluated after `stub.tsx` has put the stub
 * there - `preview.tsx` therefore pulls it in with a top level `await import()`.
 */
export { default as FancySwitch1 } from '../src/FancySwitch1';
export { default as FancySwitch2 } from '../src/FancySwitch2';
export { default as FancyDarkAnAus } from '../src/FancyDarkAnAus';
export { default as FancyDarkAnAusRev } from '../src/FancyDarkAnAusRev';
export { default as FancyDarkAnAusWippe } from '../src/FancyDarkAnAusWippe';
export { default as FancyGivaIButton } from '../src/FancyGivaIButton';
export { default as FancyToggleswitch } from '../src/FancyToggleswitch';
