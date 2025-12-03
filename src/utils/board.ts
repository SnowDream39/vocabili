/**
 * 全部整合到Board对象。
 */
import { DateTime } from 'luxon'
import { endTimeOf, issueNow, startTimeOf } from './date'

export type BoardName = 'vocaloid-daily' | 'vocaloid-weekly' | 'vocaloid-monthly' | 'special'
export type SequentialBoard = 'vocaloid-daily' | 'vocaloid-weekly' | 'vocaloid-monthly'

export function isBoardName(name: string): name is BoardName {
  return ['vocaloid-daily', 'vocaloid-weekly', 'vocaloid-monthly', 'vocaloid-special'].includes(name)
}

export function isSequentialBoard(name: string): name is SequentialBoard {
  return ['vocaloid-daily', 'vocaloid-weekly', 'vocaloid-monthly'].includes(name)
}


// 现在时间已经过了哪一期的截止时间。
export const currentIssue = issueNow()

export default class Board {
  name: BoardName = 'vocaloid-daily'
  part: string = 'main'
  issue: number | null = null

  /**
   *
   * @param boardId 可以传入 boardId，也可以只传 name 和 section。
   * @param issue 可以不传，不会指定默认值
   */
  constructor(name: string, part?: string, issue?: number) {
    if (!isBoardName(name)) {
      throw new Error(`${name} 不是一个有效的排行榜名称`)
    }
    this.name = name
    if (part){
      this.part = part
    } else {
      this.part = 'main'
    }
    if (issue) {
      this.issue = Number(issue)
    } else if (this.name === 'special') {
      this.issue = 1
    }
  }

  // 特殊构造方法
  /**
   * 只能用来构造一般排行榜，昨天那一期
   * issue 是空
   */
  static latest(name: SequentialBoard, part?: string): Board {
    const board = new Board(name, part, issueNow()[name])
    return board
  }

  get fullId(): string {
    return [this.name, this.part].join('-');
  }
  get startTime(): DateTime | null {
    if (isSequentialBoard(this.name) && this.issue) {
      return startTimeOf(this.issue, this.name)
    } else {
      return null
    }
  }
  get endTime(): DateTime | null {
    if(isSequentialBoard(this.name) && this.issue) {
      return endTimeOf(this.issue, this.name)
    } else {
      return null
    }
  }

  getBoardName() {
    const issueNum = this.issue
    if (this.name === 'vocaloid-daily'){
      return `日刊虚拟歌手外语排行榜 #${issueNum}`
    } else if (this.name === 'vocaloid-weekly'){
      return `周刊虚拟歌手外语排行榜 #${issueNum}`
    } else if (this.name === 'vocaloid-monthly'){
      return `月刊虚拟歌手外语排行榜 #${issueNum}`
    } else if (this.name === 'special'){
      return `专题虚拟歌手外语排行榜 #${issueNum}`
    }
  }

  getRankDateString() {
    if (!this.issue) {
      return ''
    }
    const issueNum = this.issue
    if (this.name === 'vocaloid-daily') {
      const firstDate = DateTime.local(2024, 7, 3)
      const startDate = firstDate.plus({days: issueNum-1})
      const endDate = firstDate.plus({days: issueNum})
      return `${startDate.toFormat('yyyy-MM-dd HH:mm')}——${endDate.toFormat('yyyy-MM-dd HH:mm')}`
    } else if (this.name === 'vocaloid-weekly'){
      const firstDate = DateTime.local(2024, 8, 31)
      const startDate = firstDate.plus({weeks: issueNum-1})
      const endDate = firstDate.plus({weeks: issueNum})
      return `${startDate.toFormat('yyyy-MM-dd HH:mm')}——${endDate.toFormat('yyyy-MM-dd HH:mm')}`
    } else {
      const firstDate = DateTime.local(2024, 7, 1)
      const startDate = firstDate.plus({months: issueNum-1})
      const endDate = firstDate.plus({months: issueNum})
      return `${startDate.toFormat('yyyy-MM-dd HH:mm')}——${endDate.toFormat('yyyy-MM-dd HH:mm')}`
    }
  }
}
