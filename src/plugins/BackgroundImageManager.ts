import { getImageSet } from "@/utils/api/image"

/** 返回"url(...)"的形式
 * */
function selectRandomPicture(pictures: string[]) {
  const originalPicture = pictures[Math.floor(Math.random() * pictures.length)]
  const picture = String(originalPicture).includes('/') ? originalPicture : `url("https://h.pixiv.ddns-ip.net/${originalPicture}")` // 默认是pixiv id，也可以输入别的
  return picture
}

class BackgroundImageManager {
  verticalPicture: string
  horizontalPicture: string
  currentMode: string
  imageSet: string | null
  verticalPictures: string[] = []
  horizontalPictures: string[] = []
  defaultPicture =
    "url('https://i.pixiv.ddns-ip.net/img-original/img/2013/04/07/01/53/07/34844544_p0.jpg')"
  el: HTMLDivElement

  // 初始化背景图片
  constructor() {
    this.currentMode = window.innerWidth < innerHeight ? 'vertical' : 'horizontal'

    this.verticalPicture = localStorage.getItem('verticalPicture') ?? this.defaultPicture
    this.horizontalPicture = localStorage.getItem('horizontalPicture') ?? this.defaultPicture
    this.imageSet = localStorage.getItem('backgroundImageSetName')
    this.el = document.getElementById('bg-img') as HTMLDivElement
    void this.loadImageSet()
    this.changePicture()
    window.addEventListener('resize', this.resize.bind(this))
  }

  async loadImageSet() {
    if (this.imageSet) {
      const pictures = await getImageSet(this.imageSet)
      this.verticalPictures = pictures.verticalPictures
      this.horizontalPictures = pictures.horizontalPictures
    }
  }

  changePicture() {
    if (this.currentMode === 'vertical') {
      this.el.style.backgroundImage = this.verticalPicture
    } else {
      this.el.style.backgroundImage = this.horizontalPicture
    }
  }

  resize() {
    const newMode = window.innerWidth < innerHeight ? 'vertical' : 'horizontal'
    if (newMode !== this.currentMode) {
      this.currentMode = newMode
      this.changePicture()
    }
  }

  refreshPicture() {
    this.verticalPicture = selectRandomPicture(this.verticalPictures)
    localStorage.setItem("verticalPicture", this.verticalPicture)
    this.horizontalPicture = selectRandomPicture(this.horizontalPictures)
    localStorage.setItem("horizontalPicture", this.horizontalPicture)

    this.verticalPicture = localStorage.getItem('verticalPicture') ?? this.defaultPicture
    this.horizontalPicture = localStorage.getItem('horizontalPicture') ?? this.defaultPicture
    this.changePicture()
    this.resize()
  }
}

export default BackgroundImageManager
