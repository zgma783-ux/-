
export enum Category {
  MOVIE = '电影',
  MUSIC = '音乐风格',
  IMAGE = '图片风格',
  NOVEL = '小说题材',
  SOCIAL_MEDIA = '自媒体题材',
  FINANCE = '财经内容',
  FASHION = '服装时尚',
  GAME = '游戏动态',
  ENTERTAINMENT = '综艺剧集',
  TECH = '科技动态'
}

export enum Region {
  GLOBAL = '全球',
  CHINA = '中国',
  USA = '美国',
  JAPAN = '日本',
  KOREA = '韩国',
  EUROPE = '欧洲'
}

export interface TrendItem {
  title: string;
  summary: string;
  reason: string;
  tags: string[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface TrendResponse {
  text: string;
  sources: GroundingChunk[];
}
