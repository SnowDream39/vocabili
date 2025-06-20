/**
 * 时间和期数的计算真的挺复杂的。
 * API返回的日期是刊物的开始时间。
 */

import { DateTime } from 'luxon'
import { type Section } from './board'

/**
 * 计算一个时间之前截止的那一期。
 * @param date 一个时间。默认现在。
 */
export function issueBefore(date?: DateTime) {
  const now = date || DateTime.local()
  return {
    daily: Math.floor(now.diff(DateTime.local(2024,7,3), 'days').toObject().days!) ,
    weekly: Math.floor(now.diff(DateTime.local(2024,8,31), 'weeks').toObject().weeks!) ,
    monthly: Math.floor(now.diff(DateTime.local(2024,7,1), 'months').toObject().months!) ,
  }
}

/**
 * 计算一个时间之前截止的那一期。
 * @param date 一个时间。默认现在。
 */
export function issueNow(date?: DateTime) {
  const now = date || DateTime.local()
  const last = issueBefore(now)
  return {
    daily: last.daily + 1,
    weekly: last.weekly + 1,
    monthly: last.monthly + 1,
  }
}


/**
 *  获取 issue 对应的开始时间
 */
export function startTimeOf(issue: number, section: Section) {
  if (section === 'daily') {
    return DateTime.local(2024,7,2).plus({days: issue})
  } else if (section === 'weekly') {
    return DateTime.local(2024,8,24).plus({weeks: issue})
  } else {
    return DateTime.local(2024,6,1).plus({months: issue})
  }
}

/**
 *  获取 issue 对应的结束时间。
 *  也就是下一个 issue 的开始时间。中间不设空隙。
 */
export function endTimeOf(issue: number, section: Section) {
  if (section === 'daily') {
    return DateTime.local(2024,7,3).plus({days: issue})
  } else if (section === 'weekly') {
    return DateTime.local(2024,8,31).plus({weeks: issue})
  } else {
    return DateTime.local(2024,7,1).plus({months: issue})
  }
}
