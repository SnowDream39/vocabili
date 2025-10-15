import type { App } from 'vue'
import { onMounted } from 'vue'

import { getImageSet } from "@/utils/api/image"

/** 返回"url(...)"的形式
 * */
function selectRandomPicture(pictures: string[]) {
  const originalPicture = pictures[Math.floor(Math.random() * pictures.length)]
  const picture = String(originalPicture).includes('/') ? `url("${originalPicture}")` : `url("https://h.pixiv.ddns-ip.net/${originalPicture}")` // 默认是pixiv id，也可以输入别的
  return picture
}

export class BackgroundImageManager {
  defaultPicture =
    "url('https://i.pixiv.ddns-ip.net/img-original/img/2013/04/07/01/53/07/34844544_p0.jpg')"
  verticalPicture: string = this.defaultPicture
  horizontalPicture: string = this.defaultPicture
  currentMode: string
  imageSet: string | null = null
  verticalPictures: string[] = []
  horizontalPictures: string[] = []
  el: HTMLDivElement | null = null

  // 设置
  /**
   * 每次打开网页是否更改背景图片
   */
  private _autoRefresh: Boolean = false

  get autoRefresh() {
    return this._autoRefresh
  }

  set autoRefresh(value: Boolean) {
    this._autoRefresh = value
    localStorage.setItem('autoRefreshBackgroundImage', value.toString())
  }

  constructor() {
    this.currentMode = window.innerWidth < window.innerHeight ? 'vertical' : 'horizontal'
  }

  // 初始化背景图片
  async init() {
    this._autoRefresh = localStorage.getItem('autoRefreshBackgroundImage') === 'true'
    this.currentMode = window.innerWidth < innerHeight ? 'vertical' : 'horizontal'

    this.verticalPicture = localStorage.getItem('verticalPicture') ?? this.defaultPicture
    this.horizontalPicture = localStorage.getItem('horizontalPicture') ?? this.defaultPicture
    this.imageSet = localStorage.getItem('backgroundImageSetName')
    this.el = document.getElementById('bg-img') as HTMLDivElement
    await this.loadImageSet()
    if (this._autoRefresh) {
      this.refreshPicture()
    }
    this.setPicture()
    window.addEventListener('resize', this.whenResize.bind(this))
  }

  /**
   * 从服务器获取图片集中的图片列表
   */
  async loadImageSet() {
    if (this.imageSet) {
      const pictures = await getImageSet(this.imageSet)
      this.verticalPictures = pictures.verticalPictures
      this.horizontalPictures = pictures.horizontalPictures
    }
  }

  /**
   * 设置背景图片
   */
  setPicture() {
    if (!this.el) return
    if (this.currentMode === 'vertical') {
      this.el.style.backgroundImage = this.verticalPicture
    } else {
      this.el.style.backgroundImage = this.horizontalPicture
    }
  }

  /**
   * 当改变窗口大小时判断是否改变图片
   */
  whenResize() {
    const newMode = window.innerWidth < innerHeight ? 'vertical' : 'horizontal'
    if (newMode !== this.currentMode) {
      this.currentMode = newMode
      this.setPicture()
    }
  }

  /**
   * 重新选择图片
   */
  refreshPicture() {
    this.verticalPicture = selectRandomPicture(this.verticalPictures)
    localStorage.setItem('verticalPicture', this.verticalPicture)
    this.horizontalPicture = selectRandomPicture(this.horizontalPictures)
    localStorage.setItem('horizontalPicture', this.horizontalPicture)
  }


}


let bgManager: BackgroundImageManager | null = null

export const BackgroundImagePlugin = {
  install(app: App) {
    if (!bgManager) {
      bgManager = new BackgroundImageManager()
    }

    // 在应用启动时提供实例
    app.provide('bgManager', bgManager)
  },
}

/**
 * 组合式函数，用于在组件中使用 BackgroundImageManager。
 */
export function useBgManager() {
  if (!bgManager) {
    bgManager = new BackgroundImageManager()
  }
  return bgManager
}

/**
 * 在根组件中调用，用于在 DOM 挂载后执行初始化。
 */
export function useInitBgManager() {
  const manager = useBgManager()
  onMounted(() => {
    void manager.init()
  })
}
