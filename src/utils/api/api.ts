import axios from "axios";
import type Board from "../board";
import type { DataItem } from "../calculator";

const api = axios.create({
  baseURL: "https://api.vocabili.top/v2",
  timeout: 20000,
});

api.interceptors.request.use(
  (config) => {
    // 例如：在请求头中加上token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

class Requester {
  static endpoint = {
    ranking: "/select/ranking",
    songRanking: "/select/song/ranking",
    song: "/select/song",
    videoSnapshot: "/select/video/snapshot",
    latestRanking: "/select/latest_ranking",
    rankingTop5: "/select/ranking/top5",
    songByAchievement: "/select/song/by_achievement",
    songByArtist: "/select/song/by_artist",
    artistInfo: '/select/artist',
    boardMetadata: "/select/board/metadata",
    search: (type: string) => `/search/${type}`,

    getBoards: '',  // TODO
  }

  constructor() {}

  async getRanking(board: Board, page = 1, pageSize = 20, orderType = 'score') {
    const res = await api.get(Requester.endpoint.ranking, {
      params: {
        board: board.name,
        part: board.part,
        issue: board.issue,
        page,
        page_size: pageSize,
        order_type: orderType
      }
    });
    return res.data;
  }

  async checkIssue(board: Board) {
    const res = await api.get(Requester.endpoint.ranking, {
      params: {
        board: board.name,
        part: board.part,
        issue: board.issue,
        page: 1,
        page_size: 1
      }
    });
    if (res.data.data.length) {
      return true;
    } else {
      return false;
    }
  }

  async getSong(id: number) {
    const res = await api.get(Requester.endpoint.song, {
      params: { id }
    });
    return res.data;
  }

  async getSongRanking(id: number, board: string, page = 1, pageSize = 20) {
    const res = await api.get(Requester.endpoint.songRanking, {
      params: { id, board, page, page_size: pageSize }
    });
    return res.data;
  }

  async getVideoSnapshot(bvid: string, page = 1, pageSize = 20) {
    const res = await api.get(Requester.endpoint.videoSnapshot, {
      params: { bvid, page, page_size: pageSize }
    });
    return res.data;
  }

  async getLatestRanking(board: string) {
    const res = await api.get(Requester.endpoint.latestRanking, {
      params: { board }
    });
    return res.data;
  }

  async getSongByAchievement(item: DataItem, level: number, page = 1, pageSize = 20) {
    const res = await api.get(Requester.endpoint.songByAchievement, {
      params: { item, level, page, page_size: pageSize }
    });
    return res.data;
  }

  async getBoardMetadata(board: Board) {
    const res = await api.get(Requester.endpoint.boardMetadata, {
      params: { board }
    });
    return res.data;
  }

  async getRankings(board: string, part: string, issues: number[], size: number){
    const res = await api.get(Requester.endpoint.getBoards, {
      params: { board, part, issue: issues.join(','), count: size }
    });
    return res.data;
  }

  async getRankingTop5(board: string, part: string, page: number, pageSize: number) {
    const res = await api.get(Requester.endpoint.rankingTop5, {
      params: { board, part, page, page_size: pageSize }
    });
    return res.data;
  }

  async getArtistSongList(type: string, id: string, page = 1, pageSize = 20): Promise<any> {
    const res = await api.get(Requester.endpoint.songByArtist, {
      params: { type, id, page, page_size: pageSize }
    });
    return res.data
  }


  async getArtistInfo(type: string, id: string): Promise<any> {
    const res = await api.get(Requester.endpoint.artistInfo, {
      params: { type, id }
    });
    return res.data
  }

  async search(type: string, keyword: string, page = 1, pageSize = 20): Promise<any> {
    // TODO
    const res =  await api.get(Requester.endpoint.search(type), {
      params: { keyword, page, page_size: pageSize }
    })
    return res.data
  }
}
export default new Requester();
