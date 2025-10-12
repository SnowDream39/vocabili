import { defineConfig, presetWind4 } from 'unocss'
import presetIcons from '@unocss/preset-icons'

export default defineConfig({
  presets: [
    presetIcons(),
    presetWind4({
      dark: 'media',
    }),
  ],
  theme: {
    colors: {
      primary: 'var(--md-sys-color-primary)',
      onPrimary: 'var(--md-sys-color-on-primary)',
      secondary: 'var(--md-sys-color-secondary)',
      onSecondary: 'var(--md-sys-color-on-secondary)',
      tertiary: 'var(--md-sys-color-tertiary)',
      onTertiary: 'var(--md-sys-color-on-tertiary)',
      surface: 'var(--md-sys-color-surface)',
      surfaceContainer: 'var(--md-sys-color-surface-container)',
      onSurface: 'var(--md-sys-color-on-surface)',
      error: 'var(--md-sys-color-error)',
      onError: 'var(--md-sys-color-on-error)',
    },
  },
  safelist: [
    'i-material-symbols-thumb-up-outline',
    'i-material-symbols-thumb-up',
    'i-material-symbols-reply',
    'i-material-symbols-reply',
    'i-material-symbols-thumb-down-outline',
    'i-material-symbols-thumb-down',
    'i-material-symbols-share',
    'i-material-symbols-share',
    'border-l-2',
    'border',
  ],
  rules: [
    ['no-scrollbar', { 'scrollbar-width': 'none' }]
  ],
  shortcuts: {
    'big-title': 'text-2xl font-bold',
    'small-title': 'text-xl font-bold',
    'glass-button': 'border-white hover:bg-white/30 active:bg-white/40 text-shadow-sm text-shadow-white dark:text-shadow-black backdrop-blur-2 rounded-md p-1 transition-colors cursor-pointer',
    'button-lg': 'text-lg border-2 rounded-md p-1',
    'suspend-panel': 'bg-surfaceContainer/70 rounded-2xl shadow-xl',
    'btn': 'px-4 py-2 rounded-full font-medium transition-colors',
    'btn-primary': 'btn bg-primary text-onPrimary hover:bg-[color-mix(in_srgb,_var(--md-sys-color-primary)_90%,_white)]',
    'btn-secondary': 'btn bg-secondary text-onSecondary hover:bg-[color-mix(in_srgb,_var(--md-sys-color-secondary)_90%,_white)]',
    'btn-tertiary': 'btn bg-tertiary text-onTertiary hover:bg-[color-mix(in_srgb,_var(--md-sys-color-tertiary)_90%,_white)]',
  }
})
