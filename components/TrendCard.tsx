
import React from 'react';
import { ExternalLink, Rocket, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { TrendResponse } from '../types';

interface TrendCardProps {
  data: TrendResponse;
  isInsight?: boolean;
  productName?: string;
}

export const TrendCard: React.FC<TrendCardProps> = ({ data, isInsight, productName }) => {
  return (
    <div className="space-y-6">
      <div className={`bg-white rounded-2xl shadow-sm border ${isInsight ? 'border-indigo-200' : 'border-slate-100'} p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500`}>
        {isInsight && (
          <div className="flex items-center gap-3 mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <Sparkles className="text-indigo-600" size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-indigo-900">未来商机分析</h4>
              <p className="text-xs text-indigo-600 font-medium">针对产品: <span className="underline decoration-indigo-300 decoration-2">{productName}</span></p>
            </div>
          </div>
        )}
        
        <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-strong:text-indigo-600 prose-ul:text-slate-600">
          <ReactMarkdown>{data.text}</ReactMarkdown>
        </div>
      </div>

      {data.sources.length > 0 && (
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-500 mb-3 flex items-center gap-2">
            <ExternalLink size={14} /> {isInsight ? '趋势参考背景' : '参考资料与延伸阅读'}
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.sources.map((source, idx) => (
              source.web && (
                <li key={idx} className="group">
                  <a 
                    href={source.web.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <span className="shrink-0 text-slate-400 mt-1">•</span>
                    <span className="line-clamp-1 group-hover:underline">{source.web.title || source.web.uri}</span>
                  </a>
                </li>
              )
            ))}
          </ul>
        </div>
      )}
      
      {isInsight && (
        <div className="text-center pb-4">
          <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <Rocket size={10} /> 以上洞察结合了今日最新全网实时数据分析
          </p>
        </div>
      )}
    </div>
  );
};
