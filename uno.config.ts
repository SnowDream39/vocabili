import { defineConfig, presetWind4, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetIcons(),
    presetWind4({
      dark: 'media',
    }),
  ],
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
  shortcuts: [

  ],
  content: {
    pipeline: {
      include: ['src/**/*.{vue,ts,js}'],
    },
  },
})
