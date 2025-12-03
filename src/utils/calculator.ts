import axios from "axios"
import Board, { isSequentialBoard, type SequentialBoard } from "./board"
import { issueNow, startTimeOf } from "./date"

/*
copyright的四种类型：
1 自制
2 搬运
3 搬运投自制
4 自制投搬运
*/

export type DataItem = 'view' | 'favorite' | 'coin' | 'like'

export interface Count {
  view: number,
  favorite: number,
  coin: number,
  like: number
}

export async function get_video_current_data(bvid: string) {
  const response = await axios.get('https://api.vocabili.top/bilibili/get-video/', {
    params: { bvid },

  })
  return response.data
}

export function difference(currentStat: Count, lastStat: Count): Count {
  return {
    view: currentStat.view - lastStat.view,
    favorite: currentStat.favorite - lastStat.favorite,
    coin: currentStat.coin - lastStat.coin,
    like: currentStat.like - lastStat.like,
  }
}



/**
 * 以现在为起点，在一批数据里面找到几天前的数据。
 * @param historyData 一些日期的总数据
 * @param name 刊的类别（daily等）
 * @returns 那天的数据
 */
export function searchData(historyData: {date: string, count: Count}[], name: SequentialBoard): Count | null {
  // history 里面的日期是那天0点数据的意思
  const date = startTimeOf(issueNow()[name], name)
  if (date.isValid) {
    const data = historyData.find((item: any) => item.date === date.toFormat('yyyy-MM-dd'))
    if (data) {
      return data.count
    }
    return null
  } else {
    throw new Error(`Invalid DateTime: ${date.invalidExplanation || "Unknown reason"}`);
  }
}

export class Calculator {
  count: Count
  viewR: number
  favoriteR: number
  coinR: number
  likeR: number
  viewP: number
  favoriteP: number
  coinP: number
  likeP: number
  fixA: number
  fixB: number
  fixC: number
  fix: number
  point: number


  constructor(count: Count, copyright: number, board: Board) {
    if (!isSequentialBoard(board.name)) throw new Error(`${board.name} 无法计算分数`)
    this.count = count
    const issue = board.issue || issueNow()[board.name]
    const view = count.view
    const favorite = count.favorite
    let coin = count.coin
    const like = count.like
    copyright = [1,3].includes(copyright) ? 1 : 2
    if (board.name === 'vocaloid-daily' && issue <= 9) {
        this.viewR = view <= 0 ? 0 : Math.min(1, Math.ceil((( coin + favorite + like ) * 25 / view) * 100) / 100)
        this.favoriteR = favorite*20 + view <=0 ? 0 : Math.min(20, Math.ceil( favorite * 20 / (favorite * 20 + view) * 40 * 100) / 100)
        this.coinR = coin <= 0 ? 0 : Math.min(40, Math.ceil((coin * 100 + view) / (coin * 100) * 10 * 100) / 100)
        this.likeR = like * 20 + view <=0 ? 0 : Math.floor((( coin + favorite ) * 100 ) / (like * 20 + view) * 100) / 100

        this.fixA = 1.0
        this.fixB = 1.0
        this.fixC = 1.0
        this.fix = 1.0

        this.viewP = Math.round(view * this.viewR)
        this.favoriteP = Math.round(favorite * this.favoriteR)
        this.coinP = Math.round(coin * this.coinR)
        this.likeP = Math.round(like * this.likeR)
        this.point = Math.round(this.viewP + this.favoriteP + this.coinP + this.likeP)
    } else if (board.name === 'vocaloid-daily' && issue >= 10 && issue <= 122) {
        const c = copyright
        this.viewR = view <= 0 ? 0 : Math.min(1, Math.ceil((( coin + favorite ) * 20 / view * 100)) / 100)
        this.favoriteR = favorite*20 + view <= 0 ? 0 : Math.min(20, Math.ceil((favorite + 2 * coin) * 10 / (favorite * 20 + view) * 40 * 100) / 100)
        this.coinR = c * coin * 40 + view <= 0 ? 0 : Math.min(40, Math.ceil(c * coin * 40  / (c * coin * 40 + view) * 80 * 100) / 100)
        this.likeR = like * 20 + view <= 0 ? 0 : Math.floor(( coin + favorite ) / (like * 20 + view) * 100 * 100) / 100

        this.fixA = 1.0
        this.fixB = 1.0
        this.fixC = 1.0
        this.fix = 1.0

        this.viewP = Math.round(view * this.viewR)
        this.favoriteP = Math.round(favorite * this.favoriteR)
        this.coinP = Math.round(coin * this.coinR)
        this.likeP = Math.round(like * this.likeR)
        this.point = Math.round(this.viewP + this.favoriteP + this.coinP + this.likeP)
      } else if ((board.name === 'vocaloid-daily' && issue >= 123 && issue <= 346) || (board.name === 'vocaloid-weekly' && issue <= 41)) {
        coin = (coin === 0 && view > 0 && favorite > 0 && like > 0) ? 1 : coin
        this.fixA = coin <= 0 ? 0 : (copyright === 1 ? 1 : Math.ceil(Math.max(1, (view + 20 * favorite + 40 * coin + 10 * like) / (200 * coin)) * 100) / 100)
        const fixA = this.fixA
        this.fixB = (view + 20*favorite) <= 0 ? 0 : Math.ceil(Math.min(1, 3 * Math.max(0, (20 * coin + 10 * like)) / (view + 20 * favorite)) * 100) / 100
        this.fixC = like + favorite <= 0 ? 0 : Math.ceil(Math.min(1, (like + favorite + 20 * coin * fixA)/(2 * like + 2 * favorite)) * 100) / 100
        this.fix = Math.round(this.fixB * this.fixC * 100) / 100

        this.viewR = view <= 0 ? 0 : Math.max(Math.ceil(Math.min(Math.max((fixA * coin + favorite), 0) * 20 / view, 1) * 100) / 100, 0)
        this.favoriteR = favorite <= 0 ? 0 : Math.max(Math.ceil(Math.min((favorite + 2 * fixA * coin) * 10 / (favorite * 20 + view) * 40, 20) * 100) / 100, 0)
        this.coinR = fixA * coin * 40 + view <= 0 ? 0 : Math.max(Math.ceil(Math.min((fixA * coin * 40) / (fixA * coin * 40 + view) * 80, 40) * 100) / 100, 0)
        this.likeR = like <= 0 ? 0 : Math.max(Math.floor(Math.min(5, Math.max(fixA * coin + favorite, 0) / (like * 20 + view) * 100) * 100) / 100, 0)

        this.viewP = Math.round(view * this.viewR)
        this.favoriteP = Math.round(favorite * this.favoriteR)
        this.coinP = Math.round(coin * this.coinR * this.fixA)
        this.likeP = Math.round(like * this.likeR)
        this.point = Math.round(Math.round(this.viewP + this.favoriteP + this.coinP + this.likeP) * this.fixB * this.fixC)
    } else if ((board.name === 'vocaloid-daily' && issue >= 347 ) || (board.name === 'vocaloid-weekly' && issue >= 42)) {
      coin = (coin === 0 && view > 0 && favorite > 0 && like > 0) ? 1 : coin
      this.fixA = coin <= 0 ? 0 : (copyright === 1 ? 1 : Math.ceil(Math.max(1, (view + 20 * favorite + 40 * coin + 10 * like) / (200 * coin)) * 100) / 100)
      const fixA = this.fixA
      this.fixB = (view + 20*favorite) <= 0 ? 0 : Math.ceil(Math.min(1, 3 * Math.max(0, (20 * coin + 10 * like)) / (view + 20 * favorite)) * 100) / 100
      this.fixC = like + favorite <= 0 ? 0 : Math.ceil(Math.min(1, (like + favorite + 20 * coin * fixA)/(2 * like + 2 * favorite)) * 100) / 100
      this.fix = Math.round(this.fixB * this.fixC * 100) / 100

      this.viewR = view <= 0 ? 0 : Math.max(Math.ceil(Math.min(Math.max((fixA * coin + favorite), 0) * 10 / view, 1) * 100) / 100, 0)
      this.favoriteR = favorite <= 0 ? 0 : Math.max(Math.ceil(Math.min((favorite + 2 * fixA * coin) * 10 / (favorite * 10 + view) * 20, 20) * 100) / 100, 0)
      this.coinR = fixA * coin * 40 + view <= 0 ? 0 : Math.max(Math.ceil(Math.min((fixA * coin * 40) / (fixA * coin * 20 + view) * 40, 40) * 100) / 100, 0)
      this.likeR = like <= 0 ? 0 : Math.max(Math.floor(Math.min(5, Math.max(fixA * coin + favorite, 0) / (like * 20 + view) * 100) * 100) / 100, 0)

      this.viewP = Math.round(view * this.viewR)
      this.favoriteP = Math.round(favorite * this.favoriteR)
      this.coinP = Math.round(coin * this.coinR * this.fixA)
      this.likeP = Math.round(like * this.likeR)
      this.point = Math.round(Math.round(this.viewP + this.favoriteP + this.coinP + this.likeP) * this.fixB * this.fixC)
    } else if (board.name === 'vocaloid-monthly' && issue <= 10){
      coin = (coin === 0 && view > 0 && favorite > 0 && like > 0) ? 1 : coin
      this.fixA = coin <= 0 ? 0 : (copyright === 1 ? 1 : Math.ceil(Math.max(1, (view + 20 * favorite + 40 * coin + 10 * like) / (200 * coin)) * 100) / 100)
      const fixA = this.fixA
      this.fixB = (view + 20*favorite) <= 0 ? 0 : Math.ceil(Math.min(1, 3 * Math.max(0, (20 * coin + 10 * like)) / (view + 20 * favorite)) * 100) / 100
      this.fixC = like + favorite <= 0 ? 0 : Math.ceil(Math.min(1, (like + favorite + 20 * coin * fixA)/(2 * like + 2 * favorite)) * 100) / 100
      this.fix = Math.round(this.fixB * this.fixC * 100) / 100

      this.viewR = view <= 0 ? 0 : Math.max(Math.ceil(Math.min(Math.max((fixA * coin + favorite), 0) * 15 / view, 1) * 100) / 100, 0)
      this.favoriteR = favorite <= 0 ? 0 : Math.max(Math.ceil(Math.min((favorite + 2 * fixA * coin) * 10 / (favorite * 10 + view) * 20, 20) * 100) / 100, 0)
      this.coinR = fixA * coin * 40 + view <= 0 ? 0 : Math.max(Math.ceil(Math.min((fixA * coin * 40) / (fixA * coin * 20 + view) * 40, 40) * 100) / 100, 0)
      this.likeR = like <= 0 ? 0 : Math.max(Math.floor(Math.min(5, Math.max(fixA * coin + favorite, 0) / (like * 20 + view) * 100) * 100) / 100, 0)

      this.viewP = Math.round(view * this.viewR)
      this.favoriteP = Math.round(favorite * this.favoriteR)
      this.coinP = Math.round(coin * this.coinR * this.fixA)
      this.likeP = Math.round(like * this.likeR)
      this.point = Math.round(Math.round(this.viewP + this.favoriteP + this.coinP + this.likeP) * this.fixB * this.fixC)
    } else if (board.name === 'vocaloid-monthly' && issue >= 11) {
      coin = (coin === 0 && view > 0 && favorite > 0 && like > 0) ? 1 : coin
      this.fixA = coin <= 0 ? 0 : (copyright === 1 ? 1 : Math.ceil(Math.max(1, (view + 20 * favorite + 40 * coin + 10 * like) / (200 * coin)) * 100) / 100)
      const fixA = this.fixA
      this.fixB = (view + 20*favorite) <= 0 ? 0 : Math.ceil(Math.min(1, 3 * Math.max(0, (20 * coin * this.fixA + 10 * like)) / (view + 20 * favorite)) * 100) / 100
      this.fixC = like + favorite <= 0 ? 0 : Math.ceil(Math.min(1, (like + favorite + 20 * coin * fixA)/(2 * like + 2 * favorite)) * 100) / 100
      this.fix = Math.round(this.fixB * this.fixC * 100) / 100

      this.viewR = view <= 0 ? 0 : Math.max(Math.ceil(Math.min(Math.max((fixA * coin + favorite), 0) * 15 / view, 1) * 100) / 100, 0)
      this.favoriteR = favorite <= 0 ? 0 : Math.max(Math.ceil(Math.min((favorite + 2 * fixA * coin) * 10 / (favorite * 10 + view) * 20, 20) * 100) / 100, 0)
      this.coinR = fixA * coin * 40 + view <= 0 ? 0 : Math.max(Math.ceil(Math.min((fixA * coin * 40) / (fixA * coin * 20 + view) * 40, 40) * 100) / 100, 0)
      this.likeR = like <= 0 ? 0 : Math.max(Math.floor(Math.min(5, Math.max(fixA * coin + favorite, 0) / (like * 20 + view) * 100) * 100) / 100, 0)

      this.viewP = Math.round(view * this.viewR)
      this.favoriteP = Math.round(favorite * this.favoriteR)
      this.coinP = Math.round(coin * this.coinR * this.fixA)
      this.likeP = Math.round(like * this.likeR)
      this.point = Math.round(Math.round(this.viewP + this.favoriteP + this.coinP + this.likeP) * this.fixB * this.fixC)
    } else {
      // 特刊

      coin = (coin === 0 && view > 0 && favorite > 0 && like > 0) ? 1 : coin
      this.fixA = coin <= 0 ? 0 : (copyright === 1 ? 1 : Math.ceil(Math.max(1, (view + 20 * favorite + 40 * coin + 10 * like) / (200 * coin)) * 100) / 100)
      const fixA = this.fixA
      this.fixB = (view + 20*favorite) <= 0 ? 0 : Math.ceil(Math.min(1, 3 * Math.max(0, (20 * coin * this.fixA + 10 * like)) / (view + 20 * favorite)) * 100) / 100
      this.fixC = like + favorite <= 0 ? 0 : Math.ceil(Math.min(1, (like + favorite + 20 * coin * fixA)/(2 * like + 2 * favorite)) * 100) / 100
      this.fix = Math.round(this.fixB * this.fixC * 100) / 100

      this.viewR = view <= 0 ? 0 : Math.max(Math.ceil(Math.min(Math.max((fixA * coin + favorite), 0) * 15 / view, 1) * 100) / 100, 0)
      this.favoriteR = favorite <= 0 ? 0 : Math.max(Math.ceil(Math.min((favorite + 2 * fixA * coin) * 10 / (favorite * 20 + view) * 40, 20) * 100) / 100, 0)
      this.coinR = fixA * coin * 40 + view <= 0 ? 0 : Math.max(Math.ceil(Math.min((fixA * coin * 40) / (fixA * coin * 40 + view) * 80, 40) * 100) / 100, 0)
      this.likeR = like <= 0 ? 0 : Math.max(Math.floor(Math.min(5, Math.max(fixA * coin + favorite, 0) / (like * 20 + view) * 100) * 100) / 100, 0)

      this.viewP = Math.round(view * this.viewR)
      this.favoriteP = Math.round(favorite * this.favoriteR)
      this.coinP = Math.round(coin * this.coinR * this.fixA)
      this.likeP = Math.round(like * this.likeR)
      this.point = Math.round(Math.round(this.viewP + this.favoriteP + this.coinP + this.likeP) * this.fixB * this.fixC)
    }
  }

  getCounts() {
    return this.count
  }

  getRatios() {
    return {
      view: this.viewR,
      favorite: this.favoriteR,
      coin: this.coinR,
      like: this.likeR
    }
  }

  getFixes() {
    return {
      a: this.fixA,
      b: this.fixB,
      c: this.fixC,
      bc: this.fix
    }
  }

  getPoints() {
    return {
      view: this.viewP,
      favorite: this.favoriteP,
      coin: this.coinP,
      like: this.likeP,
      basis: this.viewP + this.favoriteP + this.coinP + this.likeP,
      total: this.point
    }
  }

  getResults() {
    return {
      counts: this.count,
      ratios: this.getRatios(),
      fixes: this.getFixes(),
      points: this.getPoints()
    }
  }

}
