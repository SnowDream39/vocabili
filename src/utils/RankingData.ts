export interface Ranking {
    view:          number;
    part:          string;
    favorite:      number;
    issue:         number;
    coin:          number;
    rank:          number;
    count:         number;
    like:          number;
    song_id:       number;
    view_rank:     number;
    id:            number;
    favorite_rank: number;
    bvid:          string;
    coin_rank:     number;
    board:         string;
    point:         number;
    like_rank:     number;
    song:         Song;
    video:        Video;
    last:         Ranking;
}

export interface Song {
    id:           number;
    name:         string;
    type:         string;
    producers:    Uploader[];
    vocalists:    Uploader[];
    synthesizers: Uploader[];
}

export interface SongWithVideo extends Song {
    videos: Video[];
}

export interface Uploader {
    id:   number;
    name: string;
}

export interface Video {
    bvid:        string;
    title:       string;
    thumbnail:   string;
    page:        number;
    pubdate:     string;
    uploader_id: number;
    song_id:     number;
    copyright:   number;
    duration:    number;
    uploader:    Uploader;
}
