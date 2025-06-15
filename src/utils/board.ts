/**
 * 全部整合到Board对象。
 */
import { DateTime } from 'luxon'

export const currentIssue = {
  daily: Math.floor(DateTime.local().diff(DateTime.local(2024,7,2), 'days').toObject().days!) ,
  weekly: Math.floor(DateTime.local().diff(DateTime.local(2024,9,7), 'weeks').toObject().weeks!) ,
  monthly: Math.floor(DateTime.local().diff(DateTime.local(2024,7,1), 'months').toObject().months!) ,
}

export default class Board {
  name: string = 'vocaloid'
  section: string = 'daily'
  part: string = 'main'
  issue: number = -1

  constructor(boardId: string, issue?: number) {
    const items = boardId.split('-', 3)
    this.name = items[0]
    this.section = items[1]
    if (items.length === 3){
      this.part = items[2]
    } else {
      this.part = 'main'
    }
    if (issue) this.issue = issue
  }
  get id(): string {
    return [this.name, this.section].join('-');
  }
  get fullId(): string {
    return [this.name, this.section, this.part].join('-');
  }
  getBoardName() {
    const issueNum = this.issue
    if (this.section === 'daily'){
      return `日刊虚拟歌手外语排行榜 #${issueNum}`
    } else if (this.section === 'weekly'){
      return `周刊虚拟歌手外语排行榜 #${issueNum}`
    } else if (this.section === 'monthly'){
      return `月刊虚拟歌手外语排行榜 #${issueNum}`
    } else if (this.section === 'special'){
      return `专题虚拟歌手外语排行榜 #${issueNum}`
    }
  }

  getRankDateString() {
    const issueNum = this.issue
    if (this.section === 'daily') {
      const firstDate = DateTime.local(2024, 7, 3)
      const startDate = firstDate.plus({days: issueNum-1})
      const endDate = firstDate.plus({days: issueNum})
      return `${startDate.toFormat('yyyy-MM-dd HH:mm')}——${endDate.toFormat('yyyy-MM-dd HH:mm')}`
    } else if (this.section === 'weekly'){
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
