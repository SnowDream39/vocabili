import type { Song } from "./RankingTypes";


export function makeSongName(song: Song): string {
  const name = song.display_name ?? song.name;
  const is_cover = song.type === '翻唱';
  return `${name}${is_cover ? ' (翻)' : ''}`;
}
