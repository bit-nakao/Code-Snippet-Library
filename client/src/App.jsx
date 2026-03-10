import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Search, 
  Code, 
  Trash2, 
  Edit, 
  Copy, 
  ChevronRight,
  LayoutDashboard,
  Box,
  FileCode,
  Tag,
  Download,
  ExternalLink,
  ChevronLeft,
  Check,
  Package,
  Clock,
  ExternalLink as ExportIcon
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { shadesOfPurple } from 'react-syntax-highlighter/dist/esm/styles/prism';

const API_BASE = 'http://localhost:5000/api';

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

export default function App() {
  const [view, setView] = useState('list');
  const [snippets, setSnippets] = useState([]);
  const [currentSnippet, setCurrentSnippet] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchSnippets();
  }, [searchTerm, selectedCategory]);

  const fetchSnippets = async () => {
    try {
      const response = await axios.get(`${API_BASE}/snippets`, {
        params: { search: searchTerm, category: selectedCategory }
      });
      setSnippets(response.data);
    } catch (err) {
      console.error('Error fetching snippets:', err);
    }
  };

  const deleteSnippet = async (id) => {
    if (window.confirm('このスニペットを削除してもよろしいですか？')) {
      try {
        await axios.delete(`${API_BASE}/snippets/${id}`);
        fetchSnippets();
        if (currentSnippet?.id === id) setView('list');
      } catch (err) {
        console.error('Error deleting snippet:', err);
      }
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F7FA] text-[#2A2A2A] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-[#2A2A2A] text-white flex flex-col shadow-xl z-20">
        <div className="p-8 pb-10">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <div className="bg-[#00D1B2] p-2 rounded-[14px] text-white shadow-lg shadow-[#00D1B2]/20">
              <Code size={24} />
            </div>
            <span className="tracking-tight">Snippet Lib</span>
          </h1>
        </div>
        
        <nav className="flex-1 px-5 space-y-2 overflow-y-auto pb-6 custom-scrollbar">
          <button 
            onClick={() => { setView('list'); setSelectedCategory(''); }}
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
              onClick={() => { setSelectedCategory(cat.id); setView('list'); }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-[12px] transition-all duration-300 group ${selectedCategory === cat.id ? 'bg-white/10 text-[#00D1B2] font-bold border border-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <Package size={20} className={selectedCategory === cat.id ? 'text-[#00D1B2]' : 'text-slate-500 group-hover:text-slate-300'} />
              <span className="text-sm font-medium">{cat.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 bg-black/10">
          <button 
            onClick={() => setView('create')}
            className="w-full flex items-center justify-center gap-2 bg-[#00D1B2] hover:opacity-85 text-white py-4 px-4 rounded-[14px] font-bold transition-all duration-300 shadow-xl shadow-[#00D1B2]/20 active:scale-[0.97]"
          >
            <Plus size={22} />
            新規スニペット
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-24 bg-[#F5F7FA]/80 backdrop-blur-xl flex items-center justify-between px-10 z-10">
          <div className="relative w-full max-w-2xl group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00D1B2] transition-colors" size={22} />
            <input 
              type="text"
              placeholder="タイトル、カテゴリー、タグで検索..."
              className="w-full bg-white border border-transparent shadow-sm focus:shadow-indigo-500/5 rounded-[18px] pl-14 pr-6 py-4 text-base focus:ring-4 focus:ring-[#00D1B2]/10 focus:outline-none transition-all placeholder:text-slate-400 border-slate-100 focus:border-[#00D1B2]/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-10 pb-12 custom-scrollbar">
          {view === 'list' && (
            <SnippetList 
              snippets={snippets} 
              onView={(s) => { setCurrentSnippet(s); setView('detail'); }}
              onEdit={(s) => { setCurrentSnippet(s); setView('edit'); }}
              onDelete={deleteSnippet}
              category={selectedCategory}
            />
          )}

          {view === 'detail' && currentSnippet && (
            <SnippetDetail 
              snippet={currentSnippet} 
              onBack={() => setView('list')}
              onEdit={() => setView('edit')}
            />
          )}

          {(view === 'create' || view === 'edit') && (
            <SnippetForm 
              snippet={view === 'edit' ? currentSnippet : null}
              onCancel={() => setView('list')}
              onSave={() => { setView('list'); fetchSnippets(); }}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function SnippetList({ snippets, onView, onEdit, onDelete, category }) {
  const categoryLabel = CATEGORIES.find(c => c.id === category)?.label || '全スニペット';

  return (
    <div className="max-w-6xl mx-auto space-y-10 pt-4 animate-in fade-in duration-700">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-4xl font-extrabold text-[#2A2A2A] tracking-tight">{categoryLabel}</h2>
          <p className="text-slate-500 mt-2 font-medium text-lg">デベロッパーライブラリの管理</p>
        </div>
        <div className="bg-white px-6 py-2 rounded-full text-slate-400 font-oswald font-bold shadow-sm border border-slate-100 flex items-center gap-2">
           <span className="text-[#00D1B2]">{snippets.length}</span> Snippets
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
        {snippets.map(s => (
          <div 
            key={s.id} 
            onClick={() => onView(s)}
            className="bg-white border border-slate-200 rounded-[20px] p-7 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-500 group cursor-pointer border-transparent hover:border-[#00D1B2]/30"
          >
            <div className="space-y-5">
              <div className="flex justify-between items-start">
                <span className="px-3 py-1.5 bg-[#F5F7FA] text-slate-500 text-[11px] font-bold rounded-lg border border-slate-100 uppercase tracking-widest">
                  {CATEGORIES.find(c => c.id === s.category)?.label || s.category}
                </span>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                    <button 
                      onClick={() => onEdit(s)} 
                      className="p-2.5 bg-slate-50 hover:bg-[#00D1B2]/10 rounded-xl text-slate-400 hover:text-[#00D1B2] transition-all"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(s.id)} 
                      className="p-2.5 bg-slate-50 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-[#2A2A2A] leading-tight mb-2 uppercase group-hover:text-[#00D1B2] transition-colors">{s.title}</h3>
                <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed h-10">{s.description || '説明はありません。'}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {s.tags?.split(',').map(tag => (
                  <span key={tag} className="text-[11px] font-bold bg-[#F5F7FA] text-slate-400 px-3 py-1.5 rounded-full">#{tag.trim()}</span>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                 <div className="text-[12px] font-bold text-slate-300 font-oswald flex items-center gap-1.5 uppercase">
                   <Clock size={14} /> {new Date(s.updated_at).toLocaleDateString('ja-JP')}
                 </div>
                 <div className="text-[#00D1B2] font-bold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                   View <ChevronRight size={16} />
                 </div>
              </div>
            </div>
          </div>
        ))}
        
        {snippets.length === 0 && (
          <div className="col-span-full bg-white border border-slate-100 border-dashed rounded-[30px] p-24 text-center space-y-6">
             <div className="bg-[#F5F7FA] w-24 h-24 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <Box size={48} />
             </div>
             <p className="text-slate-400 font-bold text-xl uppercase tracking-tight">No Snippets Found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SnippetDetail({ snippet, onBack, onEdit }) {
  const [copied, setCopied] = useState('');
  const [vscodeJson, setVscodeJson] = useState(null);
  const [showVscode, setShowVscode] = useState(false);

  const copyToClipboard = (code, type) => {
    navigator.clipboard.writeText(code);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const generateVscodeSnippet = () => {
    const json = {
      [snippet.title]: {
        "prefix": snippet.title.toLowerCase().replace(/\s+/g, '-'),
        "body": snippet.html_code.split('\n'),
        "description": snippet.description || snippet.title
      }
    };
    setVscodeJson(JSON.stringify(json, null, 2));
    setShowVscode(true);
  };

  const CodeBlock = ({ label, code, language, type }) => (
    <div className="bg-white border border-slate-200 rounded-[24px] overflow-hidden mb-8 shadow-sm">
      <div className="bg-white/50 px-8 py-5 flex justify-between items-center border-b border-slate-100">
        <div className="flex items-center gap-3">
           <div className="w-1.5 h-1.5 rounded-full bg-[#00D1B2]"></div>
           <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">{label}</span>
        </div>
        <button 
          onClick={() => copyToClipboard(code, type)}
          className={`px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${copied === type ? 'bg-[#00D1B2] text-white shadow-lg shadow-[#00D1B2]/20' : 'bg-[#F5F7FA] hover:bg-slate-200 text-[#2A2A2A]'}`}
        >
          {copied === type ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy Code</>}
        </button>
      </div>
      <div className="p-8 overflow-x-auto text-[14px]">
        <SyntaxHighlighter 
          language={language} 
          style={shadesOfPurple}
          customStyle={{ background: 'transparent', padding: 0, margin: 0, fontSize: 'inherit' }}
        >
          {code || '// コードを入力してください'}
        </SyntaxHighlighter>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto pt-6 pb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center justify-between mb-12">
        <button onClick={onBack} className="text-slate-400 hover:text-[#2A2A2A] flex items-center gap-3 font-bold transition-all group">
          <div className="bg-white p-3 rounded-2xl group-hover:bg-[#F5F7FA] transition-all border border-slate-200 shadow-sm">
            <ChevronLeft size={24} />
          </div>
          スニペット一覧
        </button>
        <div className="flex gap-4">
          <button 
            onClick={generateVscodeSnippet}
            className="px-8 py-3.5 bg-[#2A2A2A] hover:opacity-90 text-white rounded-[14px] font-bold transition-all shadow-xl active:scale-95 flex items-center gap-2"
          >
            <ExportIcon size={18} />
            VSCodeスニペット生成
          </button>
          <button 
            onClick={onEdit} 
            className="px-8 py-3.5 bg-white text-[#2A2A2A] border font-bold border-slate-200 hover:border-[#00D1B2] rounded-[14px] transition-all hover:bg-[#00D1B2]/5 uppercase tracking-wider text-xs"
          >
            編集する
          </button>
        </div>
      </div>

      <div className="space-y-12">
        <header className="space-y-6 px-4">
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 bg-[#00D1B2]/10 text-[#00D1B2] text-[11px] font-bold rounded-lg uppercase tracking-widest border border-[#00D1B2]/20">
              {CATEGORIES.find(c => c.id === snippet.category)?.label || snippet.category}
            </span>
          </div>
          <h1 className="text-7xl font-extrabold text-[#2A2A2A] tracking-tighter leading-none uppercase">{snippet.title}</h1>
          <p className="text-2xl text-slate-400 max-w-4xl leading-relaxed font-medium">{snippet.description || '説明文がありません。'}</p>
          
          <div className="flex flex-wrap gap-3 pt-2">
            {snippet.tags?.split(',').map(tag => (
              <span key={tag} className="px-4 py-2 bg-white text-slate-400 border border-slate-100 text-[12px] font-bold rounded-full shadow-sm">#{tag.trim()}</span>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {snippet.html_code && <CodeBlock label="HTML" code={snippet.html_code} language="html" type="html" />}
          {snippet.css_code && <CodeBlock label="CSS" code={snippet.css_code} language="css" type="css" />}
          {snippet.js_code && <CodeBlock label="JavaScript" code={snippet.js_code} language="javascript" type="js" />}
        </div>
      </div>

      {showVscode && (
        <div className="fixed inset-0 bg-[#2A2A2A]/60 backdrop-blur-md z-50 flex items-center justify-center p-8 animate-in fade-in duration-500">
           <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-500">
              <div className="flex justify-between items-center">
                 <h3 className="text-3xl font-extrabold text-[#2A2A2A]">VSCode Export</h3>
                 <button onClick={() => setShowVscode(false)} className="text-slate-300 hover:text-slate-900 font-bold transition-colors">
                    閉じる
                 </button>
              </div>
              <p className="text-slate-500 text-lg font-medium">
                VSCodeの `User Snippets` ファイルに以下の内容を貼り付けてください。
              </p>
              <div className="bg-[#2A2A2A] rounded-[24px] p-8 overflow-hidden relative group">
                 <pre className="text-teal-400 text-sm font-mono overflow-auto max-h-96 leading-relaxed custom-scrollbar">{vscodeJson}</pre>
                 <button 
                    onClick={() => copyToClipboard(vscodeJson, 'vscode')}
                    className="absolute top-6 right-6 bg-white hover:bg-[#00D1B2] hover:text-white px-6 py-3 rounded-2xl text-xs font-bold transition-all shadow-xl"
                 >
                    {copied === 'vscode' ? 'Copied JSON!' : 'Copy JSON'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

function SnippetForm({ snippet, onCancel, onSave }) {
  const [formData, setFormData] = useState(snippet || {
    title: '',
    description: '',
    category: 'button',
    tags: '',
    html_code: '',
    css_code: '',
    js_code: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (snippet) {
        await axios.put(`${API_BASE}/snippets/${snippet.id}`, formData);
      } else {
        await axios.post(`${API_BASE}/snippets`, formData);
      }
      onSave();
    } catch (err) {
      console.error('Error saving snippet:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-6 pb-24 animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="flex justify-between items-center mb-12">
        <div>
           <h2 className="text-5xl font-extrabold text-[#2A2A2A] tracking-tighter uppercase">{snippet ? 'Update Snippet' : 'New Snippet'}</h2>
           <p className="text-slate-400 mt-2 font-bold text-lg uppercase tracking-widest flex items-center gap-2">
             <Box size={20} className="text-[#00D1B2]" /> 開発リソースの保存
           </p>
        </div>
        <button onClick={onCancel} className="text-slate-400 hover:text-[#2A2A2A] font-bold transition-all p-3 hover:bg-white rounded-2xl border border-transparent hover:border-slate-100 shadow-sm">
           キャンセル
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="bg-white p-10 rounded-[28px] border border-slate-100 shadow-sm space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[11px] font-bold text-[#00D1B2] uppercase tracking-[0.3em] pl-1">タイトル</label>
              <input 
                name="title"
                required
                className="w-full bg-[#F5F7FA] border border-transparent rounded-[16px] px-6 py-5 focus:ring-4 focus:ring-[#00D1B2]/5 focus:bg-white focus:border-[#00D1B2]/50 outline-none transition-all text-[#2A2A2A] font-bold text-lg placeholder:font-normal"
                placeholder="Responsive Card Header"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-4">
              <label className="text-[11px] font-bold text-[#00D1B2] uppercase tracking-[0.3em] pl-1">カテゴリー</label>
              <div className="relative">
                <select 
                  name="category"
                  className="w-full bg-[#F5F7FA] border border-transparent rounded-[16px] px-6 py-5 focus:ring-4 focus:ring-[#00D1B2]/5 focus:bg-white focus:border-[#00D1B2]/50 outline-none transition-all text-[#2A2A2A] font-bold text-lg appearance-none"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
                <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" size={24} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[11px] font-bold text-[#00D1B2] uppercase tracking-[0.3em] pl-1">説明文</label>
            <textarea 
              name="description"
              rows="3"
              className="w-full bg-[#F5F7FA] border border-transparent rounded-[16px] px-6 py-5 focus:ring-4 focus:ring-[#00D1B2]/5 focus:bg-white focus:border-[#00D1B2]/50 outline-none transition-all text-[#2A2A2A] font-medium text-lg leading-relaxed placeholder:font-normal"
              placeholder="スニペットの用途を記述してください..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-4">
            <label className="text-[11px] font-bold text-[#00D1B2] uppercase tracking-[0.3em] pl-1">タグ</label>
            <input 
              name="tags"
              className="w-full bg-[#F5F7FA] border border-transparent rounded-[16px] px-6 py-5 focus:ring-4 focus:ring-[#00D1B2]/5 focus:bg-white focus:border-[#00D1B2]/50 outline-none transition-all text-[#2A2A2A] font-bold text-lg placeholder:font-normal"
              placeholder="react, tailwind, ui"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="bg-white p-10 rounded-[28px] border border-slate-100 shadow-sm space-y-10">
           <div className="grid grid-cols-1 gap-10">
            <div className="space-y-4">
              <label className="text-[11px] font-bold text-[#2A2A2A] uppercase tracking-[0.3em] pl-1 opacity-40">HTML Code</label>
              <textarea 
                name="html_code"
                rows="8"
                className="w-full bg-[#2A2A2A] rounded-[20px] px-8 py-6 text-teal-300 font-mono text-sm focus:ring-8 focus:ring-[#00D1B2]/10 outline-none transition-all leading-relaxed custom-scrollbar border-none"
                placeholder="<div>...</div>"
                value={formData.html_code}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-4">
              <label className="text-[11px] font-bold text-[#2A2A2A] uppercase tracking-[0.3em] pl-1 opacity-40">CSS Code</label>
              <textarea 
                name="css_code"
                rows="8"
                className="w-full bg-[#2A2A2A] rounded-[20px] px-8 py-6 text-sky-400 font-mono text-sm focus:ring-8 focus:ring-[#00D1B2]/10 outline-none transition-all leading-relaxed custom-scrollbar border-none"
                placeholder=".class { ... }"
                value={formData.css_code}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-4">
              <label className="text-[11px] font-bold text-[#2A2A2A] uppercase tracking-[0.3em] pl-1 opacity-40">JS Code</label>
              <textarea 
                name="js_code"
                rows="8"
                className="w-full bg-[#2A2A2A] rounded-[20px] px-8 py-6 text-orange-400 font-mono text-sm focus:ring-8 focus:ring-[#00D1B2]/10 outline-none transition-all leading-relaxed custom-scrollbar border-none"
                placeholder="const app = () => { ... }"
                value={formData.js_code}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-6 pt-6">
          <button 
            type="button"
            onClick={onCancel}
            className="px-10 py-5 bg-white hover:bg-slate-50 text-[#2A2A2A] rounded-[18px] font-bold transition-all border border-slate-100 shadow-sm"
          >
            キャンセル
          </button>
          <button 
            type="submit"
            className="px-16 py-5 bg-[#00D1B2] hover:opacity-90 text-white rounded-[18px] font-extrabold transition-all shadow-2xl shadow-[#00D1B2]/30 active:scale-95 text-lg"
          >
            {snippet ? 'Update Snippet' : 'Save Snippet'}
          </button>
        </div>
      </form>
    </div>
  );
}
