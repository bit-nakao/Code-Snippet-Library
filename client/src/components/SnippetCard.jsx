import React from 'react';
import { 
  Trash2, 
  Edit, 
  ChevronRight,
  Clock,
  Box
} from 'lucide-react';

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

export default function SnippetCard({ snippet, onView, onEdit, onDelete }) {
  const getCategoryLabel = (id) => CATEGORIES.find(c => c.id === id)?.label || id;

  return (
    <div 
      onClick={() => onView(snippet)}
      className="bg-white border border-slate-200 rounded-[20px] overflow-hidden hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-500 group cursor-pointer border-transparent hover:border-[#00D1B2]/30"
    >
      {/* Screenshot Preview */}
      <div className="aspect-video bg-slate-100 relative overflow-hidden">
        {snippet.screenshot_url ? (
          <img 
            src={snippet.screenshot_url?.startsWith('http') ? snippet.screenshot_url : `http://localhost:5000${snippet.screenshot_url}`} 
            alt={snippet.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <Box size={48} />
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-600 text-[10px] font-bold rounded-lg border border-slate-100 uppercase tracking-widest shadow-sm">
            {getCategoryLabel(snippet.category)}
          </span>
        </div>
      </div>

      <div className="p-7 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-[#2A2A2A] leading-tight mb-2 uppercase group-hover:text-[#00D1B2] transition-colors line-clamp-1">{snippet.title}</h3>
          <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed h-10">{snippet.description || '説明はありません。'}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {snippet.tags?.split(',').map(tag => (
            <span key={tag} className="text-[10px] font-bold bg-[#F5F7FA] text-slate-400 px-3 py-1 rounded-full">#{tag.trim()}</span>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
           <div className="text-[11px] font-bold text-slate-300 font-oswald flex items-center gap-1.5 uppercase">
             <Clock size={12} /> {new Date(snippet.updated_at).toLocaleDateString('ja-JP')}
           </div>
           <div className="flex gap-2" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => onEdit(snippet)} 
                className="p-2 bg-slate-50 hover:bg-[#00D1B2]/10 rounded-lg text-slate-400 hover:text-[#00D1B2] transition-all"
              >
                <Edit size={16} />
              </button>
              <button 
                onClick={() => onDelete(snippet.id)} 
                className="p-2 bg-slate-50 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-all"
              >
                <Trash2 size={16} />
              </button>
              <div className="text-[#00D1B2] font-bold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform ml-2">
                <ChevronRight size={20} />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
