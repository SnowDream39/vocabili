import { defineAsyncComponent } from "vue";

export default function registerComponents(app) {
  // 动态导入 components 文件夹下的所有 .vue 文件
  const components = import.meta.glob('../components/*.vue');

  // 遍历导入的组件对象
  Object.entries(components).forEach(([path, definition]) => {
    // 提取文件名作为组件名
    const name = path.split('/').pop().replace('.vue', '');

    // 注册为全局组件
    app.component(name, defineAsyncComponent(definition));
  })
}