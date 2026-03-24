import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Eye, 
  Monitor, 
  Smartphone, 
  Tablet,
  Layout,
  Type,
  Maximize2,
  Download,
  Camera
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import html2canvas from 'html2canvas';
import axios from 'axios';

export default function SnippetDetail({ snippet, onBack, API_BASE, onExportVSCode, onUpdate }) {
  const [activeTab, setActiveTab] = useState('preview');
  const [copied, setCopied] = useState(null);
  const [previewSize, setPreviewSize] = useState('desktop');
  const iframeRef = useRef(null);
  const previewContainerRef = useRef(null);

  useEffect(() => {
    if (activeTab === 'preview') {
      updatePreview();
    }
  }, [activeTab, snippet]);

  const updatePreview = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const previewContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { margin: 0; padding: 20px; font-family: sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f8fafc; }
            ${snippet.css_code}
          </style>
        </head>
        <body>
          ${snippet.html_code}
          <script>
            try {
              ${snippet.js_code}
            } catch (err) {
              console.error('JS Error:', err);
            }
          </script>
        </body>
      </html>
    `;

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(previewContent);
    doc.close();
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const captureScreenshot = async () => {
    if (!previewContainerRef.current) return;
    
    try {
      const canvas = await html2canvas(previewContainerRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#f8fafc'
      });
      
      canvas.toBlob(async (blob) => {
        const file = new File([blob], "screenshot.png", { type: "image/png" });
        const formData = new FormData();
        formData.append('image', file);
        
        const BASE_URL = API_BASE.replace('/api', '');
        const res = await axios.post(`${BASE_URL}/api/upload`, formData);
        
        // Update snippet with new screenshot url
        const updatedSnippet = { ...snippet, screenshot_url: res.data.url };
        await axios.put(`${API_BASE}/snippets/${snippet.id}`, updatedSnippet);
        onUpdate(updatedSnippet);
        alert('プレビューからスクリーンショットを生成しました！');
      }, 'image/png');
    } catch (err) {
      console.error('Capture failed:', err);
    }
  };

  const getPreviewWidth = () => {
    if (previewSize === 'mobile') return '375px';
    if (previewSize === 'tablet') return '768px';
    return '100%';
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-8">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-[#00D1B2] transition-colors mb-10 font-bold group">
        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        スニペット一覧に戻る
      </button>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-4">
            <span className="px-4 py-1 bg-[#00D1B2]/10 text-[#00D1B2] text-xs font-bold rounded-full border border-[#00D1B2]/20 uppercase tracking-widest">{snippet.category}</span>
            <div className="h-px bg-slate-100 flex-1"></div>
          </div>
          <h2 className="text-5xl font-extrabold text-[#2A2A2A] leading-tight tracking-tight">{snippet.title}</h2>
          <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-2xl">{snippet.description || '説明はありません。'}</p>
          
          <div className="flex flex-wrap gap-2 pt-2">
            {snippet.tags?.split(',').map(tag => (
              <span key={tag} className="text-sm font-bold bg-white text-slate-400 px-5 py-2 rounded-xl shadow-sm border border-slate-50">#{tag.trim()}</span>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={onExportVSCode}
            className="px-8 py-4 bg-white hover:bg-slate-50 text-[#2A2A2A] rounded-2xl font-bold transition-all border border-slate-100 shadow-sm flex items-center gap-3 active:scale-95"
          >
            <Download size={20} className="text-[#00D1B2]" />
            VSCodeスニペット生成
          </button>
        </div>
      </div>

      <div className="mt-16 bg-white rounded-[32px] overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100">
        <div className="flex justify-between items-center px-8 border-b border-slate-50 bg-slate-50/30">
          <div className="flex">
            {[
              { id: 'preview', label: 'Preview', icon: Eye },
              { id: 'html', label: 'HTML', icon: Layout },
              { id: 'css', label: 'CSS', icon: Type },
              { id: 'js', label: 'JS', icon: Maximize2 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-8 py-6 text-sm font-extrabold transition-all border-b-4 ${activeTab === tab.id ? 'border-[#00D1B2] text-[#2A2A2A] bg-white' : 'border-transparent text-slate-300 hover:text-slate-500 hover:bg-white/50'}`}
              >
                <tab.icon size={18} className={activeTab === tab.id ? 'text-[#00D1B2]' : 'text-slate-200'} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {activeTab === 'preview' && (
              <div className="flex bg-slate-100 p-1.5 rounded-xl mr-4">
                <button onClick={() => setPreviewSize('mobile')} className={`p-2 rounded-lg transition-all ${previewSize === 'mobile' ? 'bg-white shadow-sm text-[#00D1B2]' : 'text-slate-400 hover:text-slate-600'}`}><Smartphone size={18} /></button>
                <button onClick={() => setPreviewSize('tablet')} className={`p-2 rounded-lg transition-all ${previewSize === 'tablet' ? 'bg-white shadow-sm text-[#00D1B2]' : 'text-slate-400 hover:text-slate-600'}`}><Tablet size={18} /></button>
                <button onClick={() => setPreviewSize('desktop')} className={`p-2 rounded-lg transition-all ${previewSize === 'desktop' ? 'bg-white shadow-sm text-[#00D1B2]' : 'text-slate-400 hover:text-slate-600'}`}><Monitor size={18} /></button>
              </div>
            )}
            
            {activeTab === 'preview' ? (
               <button 
                 onClick={captureScreenshot}
                 className="flex items-center gap-2 px-6 py-2.5 bg-[#00D1B2] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#00D1B2]/20 hover:opacity-90 active:scale-95 transition-all"
               >
                 <Camera size={18} />
                 Previewからスクショ生成
               </button>
            ) : (
              <button 
                onClick={() => copyToClipboard(snippet[`${activeTab}_code`], activeTab)}
                className="flex items-center gap-2 px-6 py-2.5 text-slate-500 hover:text-white hover:bg-[#2A2A2A] rounded-xl text-sm font-bold transition-all border border-slate-200 hover:border-[#2A2A2A]"
              >
                {copied === activeTab ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                {copied === activeTab ? 'Copied!' : 'Copy Code'}
              </button>
            )}
          </div>
        </div>

        <div className="bg-[#f8fafc] min-h-[600px]">
          {activeTab === 'preview' ? (
            <div className="p-12 flex justify-center h-full">
              <div 
                ref={previewContainerRef}
                style={{ width: getPreviewWidth() }} 
                className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 transition-all duration-500 h-[500px]"
              >
                 <iframe ref={iframeRef} className="w-full h-full border-none pointer-events-none" title="Preview" />
              </div>
            </div>
          ) : (
            <div className="p-0 bg-[#2A2A2A] h-full overflow-hidden">
               <SyntaxHighlighter
                language={activeTab}
                style={vscDarkPlus}
                customStyle={{ margin: 0, padding: '40px', fontSize: '15px', lineHeight: '1.8', height: '600px', backgroundColor: '#1E1E1E' }}
                className="custom-scrollbar"
              >
                {snippet[`${activeTab}_code`] || '// コードがありません'}
              </SyntaxHighlighter>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
