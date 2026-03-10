import React from 'react';
import { 
  Plus, 
  Code, 
  LayoutDashboard,
  Package,
  X
} from 'lucide-react';
import { clsx } from 'clsx';

const CATEGORIES = [
  { id: 'button', label: 'ボタン' },
  { id: 'list', label: 'リスト' },
  { id: 'card', label: 'カード' },
  { id: 'tab', label: 'タブ' },
  { id: 'accordion', label: 'アコーディオン' },
  { id: 'modal', label: 'モーダル' },
  { id: 'header', label: 'ヘッダー' },
  { id: 'footer', label: 'フッター' },
  { id: 'form', label: 'フォーム' },
  { id: 'slider', label: 'スライダー' },
  { id: 'navigation', label: 'ナビゲーション' },
  { id: 'layout', label: 'レイアウト' }
];

export default function Sidebar({ view, setView, selectedCategory, setSelectedCategory, isOpen, onClose }) {
  return (
    <aside className={clsx(
      "fixed inset-y-0 left-0 z-50 w-72 bg-[#2A2A2A] text-white flex flex-col shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      {/* Header with Logo and Close button */}
      <div className="p-8 pb-10 flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <div className="bg-[#00D1B2] p-2 rounded-[14px] text-white shadow-lg shadow-[#00D1B2]/20">
            <Code size={24} />
          </div>
          <span className="tracking-tight">Snippet Lib</span>
        </h1>
        {/* Mobile Close Button */}
        <button 
          onClick={onClose}
          className="lg:hidden p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all"
        >
          <X size={24} />
        </button>
      </div>
      
      {/* Category List - Scrollable */}
      <nav className="flex-1 px-5 space-y-2 overflow-y-auto pb-6 custom-scrollbar">
        <button 
          onClick={() => { setView('list'); setSelectedCategory(''); onClose(); }}
          className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-[14px] transition-all duration-300 ${view === 'list' && !selectedCategory ? 'bg-[#00D1B2] text-white font-bold shadow-md shadow-[#00D1B2]/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          <LayoutDashboard size={22} />
          <span className="text-base uppercase tracking-wider text-xs font-bold">スニペット一覧</span>
        </button>
        
        <div className="pt-8 pb-3 px-4">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">カテゴリー</p>
        </div>
        
        {CATEGORIES.map(cat => (
          <button 
            key={cat.id}
            onClick={() => { setSelectedCategory(cat.id); setView('list'); onClose(); }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-[12px] transition-all duration-300 group ${selectedCategory === cat.id ? 'bg-white/10 text-[#00D1B2] font-bold border border-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <Package size={20} className={selectedCategory === cat.id ? 'text-[#00D1B2]' : 'text-slate-500 group-hover:text-slate-300'} />
            <span className="text-sm font-medium">{cat.label}</span>
          </button>
        ))}
      </nav>

      {/* New Snippet Button - Fixed at bottom */}
      <div className="p-6 border-t border-white/5 bg-black/10">
        <button 
          onClick={() => { setView('create'); onClose(); }}
          className="w-full flex items-center justify-center gap-2 bg-[#00D1B2] hover:opacity-85 text-white py-4 px-4 rounded-[14px] font-bold transition-all duration-300 shadow-xl shadow-[#00D1B2]/20 active:scale-[0.97]"
        >
          <Plus size={22} />
          新規スニペット
        </button>
      </div>
    </aside>
  );
}
