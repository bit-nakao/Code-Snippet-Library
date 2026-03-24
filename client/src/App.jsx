import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Menu,
  X,
  Plus,
  ArrowRight
} from 'lucide-react';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SnippetCard from './components/SnippetCard';
import SnippetForm from './components/SnippetForm';
import SnippetDetail from './components/SnippetDetail';

const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:5000/api' 
  : '/api';

function App() {
  const [snippets, setSnippets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [view, setView] = useState('list'); // 'list', 'detail', 'create', 'edit'
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [vscodeSnippet, setVscodeSnippet] = useState(null);

  useEffect(() => {
    fetchSnippets();
  }, [searchTerm, selectedCategory]);

  const fetchSnippets = async () => {
    try {
      const res = await axios.get(`${API_BASE}/snippets`, {
        params: { search: searchTerm, category: selectedCategory }
      });
      setSnippets(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleCreateSnippet = async (formData) => {
    try {
      await axios.post(`${API_BASE}/snippets`, formData);
      fetchSnippets();
      setView('list');
    } catch (err) {
      console.error('Create error:', err);
      alert('スニペット登録エラー: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleUpdateSnippet = async (formData) => {
    try {
      await axios.put(`${API_BASE}/snippets/${formData.id}`, formData);
      fetchSnippets();
      setView('list');
      setSelectedSnippet(null);
    } catch (err) {
      console.error('Update error:', err);
      alert('スニペット更新エラー: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteSnippet = async (id) => {
    if (!window.confirm('このスニペットを削除してもよろしいですか？')) return;
    try {
      await axios.delete(`${API_BASE}/snippets/${id}`);
      fetchSnippets();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleExportVSCode = async (snippet) => {
    try {
      const res = await axios.get(`${API_BASE}/snippets/export/vscode/${snippet.id}`);
      setVscodeSnippet(res.data);
      setIsExportModalOpen(true);
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F7FA] font-sans text-[#2A2A2A] overflow-hidden">
      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <Sidebar 
        view={view} 
        setView={setView} 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory} 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center lg:block">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden ml-6 p-3 bg-white rounded-xl shadow-sm text-slate-500"
          >
            <Menu size={24} />
          </button>
          <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {view === 'list' && (
            <div className="p-8 lg:p-12">
              <div className="flex justify-between items-end mb-10">
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight mb-2">
                    {selectedCategory ? `${selectedCategory.toUpperCase()} スニペット` : 'すべてのスニペット'}
                  </h2>
                  <p className="text-slate-400 font-medium">{snippets.length} 個のスニペットが見つかりました</p>
                </div>
              </div>

              {snippets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[32px] border-2 border-dashed border-slate-100">
                  <div className="bg-slate-50 p-6 rounded-full mb-6">
                    <Plus size={48} className="text-slate-200" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-400">スニペットが見つかりません</h3>
                  <button 
                    onClick={() => setView('create')}
                    className="mt-6 text-[#00D1B2] font-bold flex items-center gap-2 hover:underline"
                  >
                    新しいスニペットを作成する <ArrowRight size={18} />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {snippets.map(snippet => (
                    <SnippetCard 
                      key={snippet.id} 
                      snippet={snippet} 
                      onView={(s) => { setSelectedSnippet(s); setView('detail'); }}
                      onEdit={(s) => { setSelectedSnippet(s); setView('edit'); }}
                      onDelete={handleDeleteSnippet}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {view === 'create' && (
            <SnippetForm 
              onSubmit={handleCreateSnippet} 
              onCancel={() => setView('list')} 
              API_BASE={API_BASE}
            />
          )}

          {view === 'edit' && (
            <SnippetForm 
              snippet={selectedSnippet}
              onSubmit={handleUpdateSnippet} 
              onCancel={() => setView('list')} 
              API_BASE={API_BASE}
            />
          )}

          {view === 'detail' && selectedSnippet && (
            <SnippetDetail 
              snippet={selectedSnippet}
              onBack={() => setView('list')}
              API_BASE={API_BASE}
              onExportVSCode={() => handleExportVSCode(selectedSnippet)}
              onUpdate={(updated) => setSelectedSnippet(updated)}
            />
          )}
        </div>
      </main>

      {/* Floating Action Button (Mobile Only) */}
      {view === 'list' && (
        <button 
          onClick={() => setView('create')}
          className="fixed bottom-8 right-8 w-16 h-16 bg-[#00D1B2] text-white rounded-full shadow-2xl flex items-center justify-center lg:hidden z-30 active:scale-95 transition-transform"
        >
          <Plus size={32} />
        </button>
      )}

      {/* VSCode Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl scale-in duration-300">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-[#2A2A2A] tracking-tight">VSCode Snippet JSON</h3>
                <p className="text-slate-400 text-sm mt-1">settings.json または snippets ファイルに貼り付けてください。</p>
              </div>
              <button 
                onClick={() => setIsExportModalOpen(false)}
                className="p-3 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={24} className="text-slate-300" />
              </button>
            </div>
            <div className="p-10 bg-[#2A2A2A]">
              <pre className="text-indigo-300 font-mono text-sm overflow-x-auto p-6 bg-black/20 rounded-2xl custom-scrollbar leading-relaxed">
                {JSON.stringify(vscodeSnippet, null, 2)}
              </pre>
            </div>
            <div className="p-8 flex justify-center bg-slate-50/50">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(vscodeSnippet, null, 2));
                  alert('JSONをコピーしました！');
                }}
                className="w-full py-5 bg-[#00D1B2] hover:opacity-90 text-white rounded-[20px] font-extrabold shadow-xl shadow-[#00D1B2]/20 transition-all active:scale-95"
              >
                Copy JSON to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
