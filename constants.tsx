
import React from 'react';
import { 
  Film, 
  Music, 
  Image as ImageIcon, 
  BookOpen, 
  Share2, 
  TrendingUp, 
  Shirt, 
  Gamepad2, 
  Tv,
  Cpu
} from 'lucide-react';
import { Category, Region } from './types';

export const CATEGORY_CONFIG = [
  { id: Category.TECH, label: '科技', icon: <Cpu size={20} />, prompt: '分析当前最前沿的科技动态，包括AI人工智能、消费电子新产品、半导体、航天航空及互联网技术重大突破。' },
  { id: Category.MOVIE, label: '电影', icon: <Film size={20} />, prompt: '分析最火爆的电影趋势，包括热门院线、流媒体新片及待映期待榜。' },
  { id: Category.MUSIC, label: '音乐', icon: <Music size={20} />, prompt: '总结主流平台上最流行的音乐风格、节拍或热门单曲趋势。' },
  { id: Category.FASHION, label: '时尚', icon: <Shirt size={20} />, prompt: '分析当前最火的服装风格、穿搭趋势（如多巴胺穿搭、老钱风等）及热门时尚单品。' },
  { id: Category.GAME, label: '游戏', icon: <Gamepad2 size={20} />, prompt: '总结当前最热门的游戏新作、电竞赛事及玩家社区关注的硬件或技术话题。' },
  { id: Category.ENTERTAINMENT, label: '综艺', icon: <Tv size={20} />, prompt: '汇集当前最火的电视剧、综艺节目、真人秀及娱乐圈热门趋势。' },
  { id: Category.IMAGE, label: '艺术', icon: <ImageIcon size={20} />, prompt: '分析社交媒体及AI绘画领域最火的视觉风格、滤镜或构图方式。' },
  { id: Category.NOVEL, label: '小说', icon: <BookOpen size={20} />, prompt: '汇集各大网文平台最火的小说题材、流派及爆款设定。' },
  { id: Category.SOCIAL_MEDIA, label: '自媒体', icon: <Share2 size={20} />, prompt: '分析短视频和社交媒体最容易爆火的内容选题、脚本结构及热门挑战。' },
  { id: Category.FINANCE, label: '财经', icon: <TrendingUp size={20} />, prompt: '总结金融市场的最热议题、热门板块及宏观政策动向。' },
];

export const REGION_CONFIG = [
  { id: Region.GLOBAL, label: '全球' },
  { id: Region.CHINA, label: '中国' },
  { id: Region.USA, label: '美国' },
  { id: Region.JAPAN, label: '日本' },
  { id: Region.KOREA, label: '韩国' },
  { id: Region.EUROPE, label: '欧洲' },
];
