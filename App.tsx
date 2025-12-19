
import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCcw, Calendar, ChevronRight, MapPin, Download, Lightbulb, Rocket, Zap, X } from 'lucide-react';
import { Category, Region, TrendResponse } from './types';
import { CATEGORY_CONFIG, REGION_CONFIG } from './constants';
import { fetchTrends, analyzeFutureTrends } from './services/geminiService';
import { TrendCard } from './components/TrendCard';
import { LoadingSkeleton } from './components/LoadingSkeleton';

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.TECH);
  const [selectedRegion, setSelectedRegion] = useState<Region>(Region.CHINA);
  const [data, setData] = useState<TrendResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Future Insight States
  const [isInsightMode, setIsInsightMode] = useState(false);
  const [userProduct, setUserProduct] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const loadData = useCallback(async (category: Category, region: Region) => {
    setLoading(true);
    setError(null);
    setIsInsightMode(false);
    try {
      const config = CATEGORY_CONFIG.find(c => c.id === category);
      if (config) {
        const result = await fetchTrends(config.prompt, region);
        setData(result);
      }
    } catch (err) {
      setError('获取数据时遇到问题，可能是 API 额度或网络限制，请稍后重试。');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFutureAnalysis = async () => {
    if (!userProduct.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeFutureTrends(userProduct, selectedCategory, selectedRegion);
      setData(result);
      setIsInsightMode(true);
    } catch (err) {
      setError('深度分析失败，请检查网络后重试。');
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    loadData(selectedCategory, selectedRegion);
  }, [selectedCategory, selectedRegion, loadData]);

  const today = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  const handleExport = () => {
    if (!data) return;

    const dateStr = new Date().toISOString().split('T')[0];
    const prefix = isInsightMode ? '未来洞察' : '今日爆火';
    const fileName = `${prefix}_${selectedCategory}_${selectedRegion}_${dateStr}.md`;
    
    let content = `# ${prefix}趋势报告 - ${selectedCategory} (${selectedRegion})\n`;
    if (isInsightMode) content += `关联产品: ${userProduct}\n`;
    content += `生成日期: ${today}\n\n`;
    content += `---\n\n`;
    content += data.text;
    content += `\n\n---\n`;
    content += `## 参考资料\n`;
    
    if (data.sources.length > 0) {
      data.sources.forEach(source => {
        if (source.web) {
          content += `- [${source.web.title || source.web.uri}](${source.web.uri})\n`;
        }
      });
    } else {
      content += `（暂无外部链接引用）\n`;
    }

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-12 bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md">
                <RefreshCcw size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  {isInsightMode ? '前瞻洞察' : '今日爆火'}
                </h1>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider flex items-center gap-1">
                  <Calendar size={10} /> {today}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {data && !loading && (
                <button 
                  onClick={handleExport}
                  title="导出为 Markdown"
                  className="p-2 rounded-full hover:bg-indigo-50 text-indigo-600 transition-colors flex items-center gap-1 text-sm font-medium"
                >
                  <Download size={18} />
                  <span className="hidden sm:inline">导出</span>
                </button>
              )}
              <button 
                onClick={() => loadData(selectedCategory, selectedRegion)}
                disabled={loading || isAnalyzing}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors disabled:opacity-30"
              >
                <RefreshCcw size={18} className={(loading || isAnalyzing) ? 'animate-spin text-indigo-600' : ''} />
              </button>
            </div>
          </div>

          {/* Region Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <div className="shrink-0 text-slate-400 p-1">
              <MapPin size={16} />
            </div>
            {REGION_CONFIG.map((reg) => (
              <button
                key={reg.id}
                onClick={() => setSelectedRegion(reg.id)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  selectedRegion === reg.id
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {reg.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-32 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm">
              <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">趋势类别</p>
              <nav className="space-y-1">
                {CATEGORY_CONFIG.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {React.cloneElement(cat.icon as React.ReactElement, { size: 18, strokeWidth: selectedCategory === cat.id ? 2.5 : 2 })}
                      {cat.label}
                    </div>
                  </button>
                ))}
              </nav>
            </div>

            {/* Business Synergy Card - Desktop */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-5 text-white shadow-lg shadow-indigo-200">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={20} className="text-yellow-300" />
                <h3 className="font-bold text-sm">跨界商机助手</h3>
              </div>
              <p className="text-xs text-indigo-100 mb-4 leading-relaxed">输入你的产品，分析它如何与当前【{selectedCategory}】趋势结合。</p>
              <input 
                type="text" 
                placeholder="例如: 智能手表、奶茶品牌..."
                value={userProduct}
                onChange={(e) => setUserProduct(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 mb-3"
              />
              <button 
                onClick={handleFutureAnalysis}
                disabled={isAnalyzing || !userProduct}
                className="w-full bg-white text-indigo-600 rounded-lg py-2 text-xs font-bold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isAnalyzing ? <RefreshCcw size={14} className="animate-spin" /> : <Rocket size={14} />}
                即刻生成洞察
              </button>
            </div>
          </div>
        </aside>

        {/* Content */}
        <section className="lg:col-span-9 space-y-4">
          {/* Mobile Insight Input */}
          <div className="lg:hidden bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-2">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={16} className="text-indigo-600" />
              <span className="text-sm font-bold text-slate-700">将【我的产品】与【{selectedCategory}】趋势结合</span>
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="我的产品/创意..."
                value={userProduct}
                onChange={(e) => setUserProduct(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button 
                onClick={handleFutureAnalysis}
                disabled={isAnalyzing || !userProduct}
                className="bg-indigo-600 text-white rounded-xl px-4 py-2 text-sm font-bold shadow-md shadow-indigo-100 disabled:opacity-50"
              >
                {isAnalyzing ? <RefreshCcw size={16} className="animate-spin" /> : '洞察'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-2">
             <h2 className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
               {selectedCategory} <ChevronRight size={14} /> {selectedRegion}
               {isInsightMode && <span className="ml-2 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px]">前瞻模式</span>}
             </h2>
             {isInsightMode && (
               <button 
                onClick={() => loadData(selectedCategory, selectedRegion)}
                className="text-[10px] text-slate-400 flex items-center gap-1 hover:text-slate-600"
               >
                 <X size={12} /> 返回爆火趋势
               </button>
             )}
          </div>
          
          {error ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCcw size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">出错了</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">{error}</p>
              <button 
                onClick={() => loadData(selectedCategory, selectedRegion)}
                className="px-8 py-2.5 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all text-sm shadow-lg shadow-slate-200"
              >
                再次尝试
              </button>
            </div>
          ) : (loading || isAnalyzing) ? (
            <LoadingSkeleton />
          ) : data ? (
            <TrendCard data={data} isInsight={isInsightMode} productName={userProduct} />
          ) : null}
        </section>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-4 left-4 right-4 bg-white/90 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-2xl z-40 overflow-hidden">
        <div className="flex items-center gap-1 overflow-x-auto px-2 py-2 no-scrollbar">
          {CATEGORY_CONFIG.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                selectedCategory === cat.id ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {React.cloneElement(cat.icon as React.ReactElement, { size: 20 })}
              <span className="text-[9px] font-bold whitespace-nowrap">{cat.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default App;
