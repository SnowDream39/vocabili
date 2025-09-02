<template>
  <article class="shadow-box">
    <h2>关于项目</h2>
    <p>术力口数据库的目标是做最专业的bilibili术力口数据统计。</p>
    <p>术力口数据库开始于2024年6月中旬，在7月4日发布第一期日刊。之后，发布的统计刊物扩展到周刊、月刊以及其他特刊。</p>
    <p>术力口数据库的团队始终开放，我们还有大量计划中的工作，随时欢迎你的加入。</p>
    <div style="text-align: center;"><el-link type="primary" href="https://space.bilibili.com/3546611315640327" target="_blank" >B站：术力口数据姬</el-link></div>
    <div style="text-align: center;"><el-link type="primary" href="https://qm.qq.com/q/x4FWrbSXw" target="_blank" >QQ群：974585468</el-link></div>
    <div style="text-align: center;"><el-link type="primary" href="https://afdian.com/a/vocabili" target="_blank" >爱发电</el-link></div>
    <h2>广告位招租</h2>
    <p>欢迎联系我们投放广告，页顶页底侧边弹窗应有尽有。</p>
    <p>目前定价每月10元。</p>
    <h2>制作人员</h2>
    <div id="credits">
    <p><a href="https://blog.snowdream39.top" target="_blank">幻梦</a>（什么都做）</p>
    <p>Ace_Bligh（数据、收录）</p>
    <p>太稽化近视铁包袱（收录）</p>
    <p>Sayonzei（收录）</p>
    <p>菱角lenjow（美工）</p>
    <p>若汐ミク（歌曲截取）</p>
    <p>ETeyondLitle（网站后端）</p>
    <p>李慕路（网页样式）</p>
    </div>
    <h2>相关站点</h2>
    <ul>
      <li><el-link type="primary" href="https://moegirl.vocabili.top/" target="_blank">萌娘百科条目生成工具</el-link></li>
    </ul>
    <h2>友情链接</h2>
    <ul>
      <li><el-link type="primary" href="https://www.vocarancn.cc/" target="_blank" >周刊Vocaloid排行榜数据汇总</el-link></li>
      <li><el-link type="primary" href="https://vocaloid-rankings.fly.dev" target="_blank" >Vocaranking</el-link></li>
      <li><el-link type="primary" href="https://monitor.lisfox.top/" target="_blank" >VOCALOID-Video-Monitor</el-link></li>
      <li><el-link type="primary" href="https://ys.mihoyo.com" target="_blank" >原神</el-link></li>
      <li><el-link type="primary" href="https://acetaffy.org" target="_blank" >永雏塔菲百科</el-link></li>
    </ul>
  </article>

</template>

<script lang="ts" setup>

</script>


<style lang="scss" scoped>

main {
  display: flex;
  flex-direction: column;
  align-items: center;
}

h2 {
  font-size: 20px;
  font-weight: bold;
}

#credits {
  columns: 2;
}

article {
  z-index: 1;
  box-sizing: border-box;
  max-width: 100%;
  width: max(500px, 50%);
  padding: 10px 20px 10px 20px;

}

ul li {
  padding: 2px 0;
}

.el-link {
  font-size: large;
}


</style>
