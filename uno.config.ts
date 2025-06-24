import { defineConfig, presetWind4, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetIcons(),
    presetWind4({
      dark: 'media',
    }),
  ],
  safelist: [

  ],
  shortcuts: [

  ],
  content: {
    pipeline: {
      include: ['src/**/*.{vue,ts,js}'],
    },
  },
})
