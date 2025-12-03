export interface BoardData {
    board:    Board[];
    metadata: DataMetadata;
}

export interface Board {
    rank:   Rank;
    point:  number;
    count:  number;
    change: Change;
    target: BoardTarget;
    last?: Last;
}

export interface Rank {
    view:     number;
    like:     number;
    coin:     number;
    favorite: number;
    board:   number;
}

export interface Change {
    view:     number;
    like:     number;
    coin:     number;
    favorite: number;
}

export interface BoardTarget {
    metadata: TargetMetadata;
    platform: Platform;
}

export interface TargetMetadata {
    id:     string;
    name:   string;
    type:   string;
    target: MetadataTarget;
}

export interface MetadataTarget {
    producer:    Uploader[];
    vocalist:    Vocalist[];
    synthesizer: Uploader[];
}

export interface Uploader {
    id:   string;
    name: string;
}

export interface Vocalist {
    id:    string;
    name:  string;
    color: number;
}

export interface Platform {
    id:        string;
    page:      number;
    link:      string;
    publish:   string;
    title:     string;
    uploader:  Uploader[];
    duration:  number;
    copyright: number;
    thumbnail: string;
}

export interface Last {
    rank:   number;
    point:  number;
}

export interface DataMetadata {
    id:    string;
    issue: string;
    part:  string;
    count: number;
}

export interface BoardMetadata {
    id:    string;
    issue: string;
    part:  string;
}
