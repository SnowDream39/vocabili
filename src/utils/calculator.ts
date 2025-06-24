import Board from "./board"

/*
copyright的四种类型：
1 自制
2 搬运
3 搬运投自制
4 自制投搬运
*/

interface Count {
  view: number,
  favorite: number,
  coin: number,
  like: number
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
    this.count = count
    const view = count.view
    const favorite = count.favorite
    let coin = count.coin
    const like = count.like
    copyright = [1,3].includes(copyright) ? 1 : 2
    if (board.section === 'daily' && board.issue <= 9) {
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
    } else if (board.section === 'daily' && board.issue >= 10 && board.issue <= 122) {
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
      } else if ((board.section === 'daily' && board.issue >= 123 && board.issue <= 346) || (board.section === 'weekly' && board.issue <= 41)) {
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
    } else if ((board.section === 'daily' && board.issue >= 347 ) || (board.section === 'weekly' && board.issue >= 42)) {
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
    } else if (board.section === 'monthly' && board.issue <= 10){
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
    } else if (board.section === 'monthly' && board.issue >= 11) {
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
