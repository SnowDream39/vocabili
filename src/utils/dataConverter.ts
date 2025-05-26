import { DateTime, Duration } from 'luxon'
import { Calculator } from './calculator'
import Issue from './board'
import type Board from './board'

interface Metadata {
  id: string,
  name?: string,
  date?: string,
  issue: number,
  count?: number
}

interface Artist {
  id: string,
  name: string,
}

interface Vocalist extends Artist {
  color: number
}


function compareRank(rank_current: number, rank_before: number) {
  if (!rank_before) {
    return "new"
  } else if (rank_current > rank_before) {
    return "down"
  } else if (rank_current == rank_before) {
    return "cont"
  } else {
    return "up"
  }
}

export function boardToPlain(data: any, board: Board, meta: Metadata) {
  try{

    const {rank,count,change:stat,target:songInfo,last} = data
    const {id:boardId, issue:issueNum} = meta
    const issue = new Issue(boardId, issueNum)
    

    let [id,name,type] = ['','','']
    let [vocalist,producer,synthesizer] = [([] as Vocalist[]),([] as Artist[]),([] as Artist[])]
    if (songInfo.metadata) {
      const metadata = songInfo.metadata
      id = metadata.id
      name = metadata.name
      type = metadata.type
      let target = metadata.target

      if (target){
        vocalist = target.vocalist
        producer = target.producer
        synthesizer = target.synthesizer
      }
    }
    
    let [link,page,title,publish,uploader,thumbnail,duration,copyright] = ['',0,'','',([] as Artist[]),'',0,0]
    const platform = songInfo.platform
    if(platform.link !== undefined){
      if (platform) {
        link = platform.link
        page = platform.page
        title = platform.title
        publish = platform.publish
        uploader = platform.uploader
        thumbnail = platform.thumbnail
        duration = platform.duration
        copyright = platform.copyright
      }
    }


    const calc = new Calculator(stat, copyright, issue)
    let [change,rank_before,point_before,rate] = ['new',0,0,'']
    if (last) {
      change = compareRank(rank.board, last.rank)
      rank_before = last.rank
      point_before = last.point
      rate = ((calc.point - point_before) / point_before * 100).toFixed(2) + '%'
    }

    const plainData = {
      id: id,
      title: title,
      link: link,
      name: name,
      author: producer ? producer.map(item => item.name).join("、") : '',
      uploader: uploader ? uploader.map(item => item.name).join("、") : '',
      copyright: copyright,
      synthesizer: synthesizer  ? synthesizer.map(item => item.name).join("、") : '',
      vocal: vocalist ? (vocalist.map(item => item.name)).join("、") : '',
      colors: vocalist ? vocalist.map(item => '#' + item.color.toString(16).toUpperCase().padStart(6, "0")) : '',
      vocal_colors: vocalist ? vocalist.map(item => item.color) : '',
      type: type,
      pubdate: publish ? DateTime.fromISO(publish).toFormat('yyyy-LL-dd HH:mm') : '',
      duration: duration ? Duration.fromMillis(duration * 1000).toFormat('m分s秒') : '',
      page: page,
      view: stat.view,
      favorite: stat.favorite,
      coin: stat.coin,
      like: stat.like,
      viewR: calc.viewR.toFixed(2),
      favoriteR: calc.favoriteR.toFixed(2),
      coinR: calc.coinR.toFixed(2),
      likeR: calc.likeR.toFixed(2),
      fixA: calc.fixA.toFixed(2),
      fixB: calc.fixB.toFixed(2),
      fixC: calc.fixC.toFixed(2),
      fix: calc.fix.toFixed(2),
      point: calc.point,
      image_url: thumbnail,
      view_rank: rank.view,
      favorite_rank: rank.favorite,
      coin_rank: rank.coin,
      like_rank: rank.like,
      rank: rank.board,
      rank_before: rank_before,
      point_before: point_before,
      rate: rate,
      count: count,
      change: change,
      board: board,
      issue: issueNum
    }
    return plainData
  }catch (error){
    console.log(error, board)
    return {}
  }
}


export function poolToPlain(achieve: any) {
  try{

    const {rank,count,target:songInfo} = achieve
    

    let [id,name,type] = ['','','']
    let [vocalist,producer,synthesizer] = [([] as Vocalist[]),([] as Artist[]),([] as Artist[])]
    if (songInfo.metadata) {
      const metadata = songInfo.metadata
      id = metadata.id
      name = metadata.name
      type = metadata.type
      let target = metadata.target

      if (target){
        vocalist = target.vocalist
        producer = target.producer
        synthesizer = target.synthesizer
      }
    }
    
    let [link,page,title,publish,uploader,thumbnail,duration,copyright] = ['',0,'','',([] as Artist[]),'',0,0]
    const platform = songInfo.platform
    if(platform.link !== undefined){
      if (platform) {
        link = platform.link
        page = platform.page
        title = platform.title
        publish = platform.publish
        uploader = platform.uploader
        thumbnail = platform.thumbnail
        duration = platform.duration
        copyright = platform.copyright
      }
    }

    const plainData = {
      id: id,
      title: title,
      link: link,
      name: name,
      author: producer ? producer.map(item => item.name).join("、") : '',
      uploader: uploader ? uploader.map(item => item.name).join("、") : '',
      copyright: copyright,
      synthesizer: synthesizer  ? synthesizer.map(item => item.name).join("、") : '',
      vocal: vocalist ? (vocalist.map(item => item.name)).join("、") : '',
      colors: vocalist ? vocalist.map(item => '#' + item.color.toString(16).toUpperCase().padStart(6, "0")) : '',
      vocal_colors: vocalist ? vocalist.map(item => item.color) : '',
      type: type,
      pubdate: publish ? DateTime.fromISO(publish).toFormat('yyyy-LL-dd HH:mm') : '',
      duration: duration ? Duration.fromMillis(duration * 1000).toFormat('m分s秒') : '',
      page: page,
      view: count.view,
      favorite: count.favorite,
      coin: count.coin,
      like: count.like,
      image_url: thumbnail,
      rank: rank,
      count: count,
    }
    return plainData
  }catch (error){
    console.log(error)
    return {}
  }
}