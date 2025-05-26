// BackgroundImageManager.js
const BackgroundImageManager = {

  // 初始化背景图片
  init() {
    const savedBackground = localStorage.getItem(this.key);
    if (savedBackground) {
      document.body.style.backgroundImage = `url(${savedBackground})`;
    }
  },

  // 设置背景图片
  set(imageUrl) {
    document.body.style.backgroundImage = `url(${imageUrl})`;
    localStorage.setItem(this.key, imageUrl);
  },

  // 清除背景图片
  clear() {
    document.body.style.backgroundImage = '';
    localStorage.removeItem(this.key);
  },

  // 获取当前背景图片
  get() {
    return localStorage.getItem(this.key);
  },
};

export default BackgroundImageManager;
