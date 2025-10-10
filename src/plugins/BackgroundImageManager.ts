class BackgroundImageManager {
  verticalPicture: string
  horizontalPicture: string
  currentMode: string
  defalutPicture =
    "url('https://i.pixiv.ddns-ip.net/img-original/img/2013/04/07/01/53/07/34844544_p0.jpg')"
  el: HTMLDivElement

  // 初始化背景图片
  constructor() {
    this.currentMode = window.innerWidth < innerHeight ? 'vertical' : 'horizontal'

    this.verticalPicture = localStorage.getItem('verticalPicture') ?? this.defalutPicture
    this.horizontalPicture = localStorage.getItem('horizontalPicture') ?? this.defalutPicture
    this.el = document.getElementById('bg-img') as HTMLDivElement
    this.changePicture()
    window.addEventListener('resize', this.resize.bind(this))
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
    this.verticalPicture = localStorage.getItem('verticalPicture') ?? this.defalutPicture
    this.horizontalPicture = localStorage.getItem('horizontalPicture') ?? this.defalutPicture
    this.changePicture()
    this.resize()
  }
}

export default BackgroundImageManager
