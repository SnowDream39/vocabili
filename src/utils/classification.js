/**
 * ET给我的代码，我没用它
 */

/**
 * 对一个数组中的元素进行分类
 * 
 * @callback ClassificationNamer
 * @param {any} value 需要进行命名的目标
 * @param {number} index 目标在列表中的索引
 * @param {any[]} list 目标所处的数组
 * @returns {string} 给目标的名字
 * 
 * @param {any[]} list 需要进行分类的数组
 * @param {ClassificationNamer} namer 为每个子元素命名的回调方法
 * @returns {Object<string, any[]>} 分类的结果
 */
export function classification(list, namer) {
  const result = {};

  for (let index = 0; index < list.length; index++) {
    const name = namer(
      list[index], index, list
    );

    if (result[name]) {
      result[name].push(list[index]);
    } else {
      result[name] = [ list[index] ];
    }
}

  return result;
}