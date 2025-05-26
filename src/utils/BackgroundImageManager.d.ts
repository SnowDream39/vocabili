declare const BackgroundImageManager: {
  /**
   * 初始化背景图片。
   */
  init: () => void;

  /**
   * 设置背景图片。
   * @param imageUrl 背景图片的 URL。
   */
  set: (imageUrl: string) => void;

  /**
   * 清除背景图片。
   */
  clear: () => void;

  /**
   * 获取当前背景图片 URL。
   * @returns 背景图片的 URL 或 null。
   */
  get: () => string | null;

  /**
   * 本地存储的 key。
   */
  key: string;
};

export default BackgroundImageManager;
