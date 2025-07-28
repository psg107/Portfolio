import { UI_CONFIG } from "./constants.js";

export const GridLayoutController = {
  setGridLayout(large = UI_CONFIG.GRID.SMALL_SCREEN, medium = UI_CONFIG.GRID.SMALL_SCREEN, small = UI_CONFIG.GRID.SMALL_SCREEN) {
    const root = document.documentElement;
    root.style.setProperty('--grid-large', large);
    root.style.setProperty('--grid-medium', medium);
    root.style.setProperty('--grid-small', small);
  },

  resetToDefault() {
    this.setGridLayout();
  },

  setLayout1Column() {
    this.setGridLayout(1, 1, 1);
  },

  setLayout2Column() {
    this.setGridLayout(2, 2, 1);
  },

  setLayout3Column() {
    this.setGridLayout(3, 2, 1);
  },

  getCurrentLayout() {
    const root = document.documentElement;
    return {
      large: parseInt(root.style.getPropertyValue('--grid-large') || UI_CONFIG.GRID.LARGE_SCREEN),
      medium: parseInt(root.style.getPropertyValue('--grid-medium') || UI_CONFIG.GRID.MEDIUM_SCREEN),
      small: parseInt(root.style.getPropertyValue('--grid-small') || UI_CONFIG.GRID.SMALL_SCREEN)
    };
  }
};

window.GridLayoutController = GridLayoutController;
