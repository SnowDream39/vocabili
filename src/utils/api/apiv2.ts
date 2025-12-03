import axios from "axios";
import type Board from "../boardv2";

const api = axios.create({
  baseURL: "http://localhost:8000",
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

  }

  constructor() {}

  async getRanking(board: Board, page = 1, pageSize = 20, orderType = 'score.total') {
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
    if (res.data) {
      return true;
    } else {
      return false;
    }
  }

  async getSong(id: number) {
    const res = await api.get(Requester.endpoint.song, {
      params: {
        id
      }
    });
    return res.data;
  }

  async getSongRanking(id: number, board: string, page = 1, pageSize = 20) {
    const res = await api.get(Requester.endpoint.songRanking, {
      params: {
        id,
        board,
        page,
        page_size: pageSize
      }
    });
    return res.data;
  }

  async getVideoSnapshot(bvid: string, page = 1, pageSize = 20) {
    const res = await api.get(Requester.endpoint.videoSnapshot, {
      params: {
        bvid,
        page,
        page_size: pageSize
      }
    });
    return res.data;
  }

  async getLatestRanking(board: string) {
    const res = await api.get(Requester.endpoint.latestRanking, {
      params: {
        board
      }
    });
    return res.data;
  }

}
export default new Requester();
