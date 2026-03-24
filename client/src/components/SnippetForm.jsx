import React, { useState, useCallback } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon,
  Link as LinkIcon,
  Plus
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

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

export default function SnippetForm({ snippet, onSubmit, onCancel, API_BASE }) {
  const [formData, setFormData] = useState(snippet || {
    title: '',
    description: '',
    category: 'button',
    tags: '',
    html_code: '',
    css_code: '',
    js_code: '',
    screenshot_url: ''
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    
    uploadImage(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
    multiple: false
  });

  const uploadImage = async (file) => {
    setIsUploading(true);
    
    try {
      // 1. Convert file to Base64
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });

      // 2. Send JSON instead of FormData to bypass Vercel Serverless limitations with multipart/form-data
      const payload = {
        image: base64Data,
        filename: file.name,
        contentType: file.type
      };

      const BASE_URL = API_BASE.replace('/api', '');
      const res = await axios.post(`${BASE_URL}/api/upload`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setFormData(prev => ({ ...prev, screenshot_url: res.data.url }));
    } catch (err) {
      console.error('Upload failed:', err);
      const errMsg = err.response?.data?.error || err.message;
      alert(`画像のアップロードに失敗しました。\nエラー詳細: ${errMsg}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle clipboard paste
  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            uploadImage(file);
        }
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-4xl font-extrabold text-[#2A2A2A] tracking-tight">{snippet ? 'スニペットを編集' : '新規スニペット作成'}</h2>
          <p className="text-slate-400 mt-2 font-medium">美しいコードとプレビューを保存しましょう。</p>
        </div>
        <button onClick={onCancel} className="p-4 hover:bg-slate-100 rounded-full transition-colors">
          <X size={32} className="text-slate-300" />
        </button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-10" onPaste={handlePaste}>
        {/* Basic Info Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <label className="text-[11px] font-bold text-[#2A2A2A] uppercase tracking-[0.3em] pl-1 opacity-40">Title</label>
              <input 
                name="title"
                className="w-full bg-white border-2 border-slate-100 rounded-[22px] px-8 py-5 text-xl font-bold focus:border-[#00D1B2] focus:ring-8 focus:ring-[#00D1B2]/5 focus:outline-none transition-all placeholder:text-slate-200"
                placeholder="コンポーネント名を入力..."
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[11px] font-bold text-[#2A2A2A] uppercase tracking-[0.3em] pl-1 opacity-40">Category</label>
                <select 
                  name="category"
                  className="w-full bg-white border-2 border-slate-100 rounded-[22px] px-8 py-5 text-lg font-bold focus:border-[#00D1B2] focus:outline-none transition-all appearance-none cursor-pointer"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-[11px] font-bold text-[#2A2A2A] uppercase tracking-[0.3em] pl-1 opacity-40">Tags</label>
                <input 
                  name="tags"
                  className="w-full bg-white border-2 border-slate-100 rounded-[22px] px-8 py-5 text-lg font-bold focus:border-[#00D1B2] focus:outline-none transition-all placeholder:text-slate-200"
                  placeholder="タグをカンマ区切りで入力..."
                  value={formData.tags}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-bold text-[#2A2A2A] uppercase tracking-[0.3em] pl-1 opacity-40">Description</label>
              <textarea 
                name="description"
                rows="3"
                className="w-full bg-white border-2 border-slate-100 rounded-[22px] px-8 py-5 text-lg font-medium focus:border-[#00D1B2] focus:outline-none transition-all placeholder:text-slate-200 resize-none"
                placeholder="このスニペットの使い方や特徴を記述してください..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Screenshot Upload Sidebar */}
          <div className="space-y-4">
            <label className="text-[11px] font-bold text-[#2A2A2A] uppercase tracking-[0.3em] pl-1 opacity-40">Main Screenshot</label>
            <div 
              {...getRootProps()} 
              className={`relative aspect-video rounded-[24px] border-4 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden ${isDragActive ? 'border-[#00D1B2] bg-[#00D1B2]/5' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
            >
              <input {...getInputProps()} />
              {formData.screenshot_url ? (
                <>
                  <img 
                    src={formData.screenshot_url?.startsWith('http') ? formData.screenshot_url : `http://localhost:5000${formData.screenshot_url}`} 
                    className="w-full h-full object-cover" 
                    alt="Preview" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold gap-2">
                    <Upload size={20} /> 画像を変更 (D&D / Paste)
                  </div>
                </>
              ) : (
                <div className="text-center p-6 space-y-3">
                  <div className="bg-slate-50 p-4 rounded-full inline-block text-slate-300">
                    <ImageIcon size={32} />
                  </div>
                  <p className="text-slate-400 text-sm font-bold">画像をドロップするか<br/>直接貼り付けてください</p>
                </div>
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#00D1B2] border-t-transparent"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Code Editors */}
        <div className="space-y-12 pt-8">
          <div className="flex items-center gap-4">
            <div className="h-px bg-slate-100 flex-1"></div>
            <span className="text-[11px] font-bold text-[#2A2A2A] uppercase tracking-[0.5em] opacity-40">Code Implementation</span>
            <div className="h-px bg-slate-100 flex-1"></div>
          </div>

          <div className="grid grid-cols-1 gap-12">
            <div className="space-y-4">
              <label className="text-[11px] font-bold text-[#2A2A2A] uppercase tracking-[0.3em] pl-1 opacity-40 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400"></div> HTML Structure
              </label>
              <textarea 
                name="html_code"
                rows="6"
                className="w-full bg-[#2A2A2A] rounded-[24px] px-10 py-8 text-white font-mono text-sm focus:ring-8 focus:ring-[#00D1B2]/10 outline-none transition-all leading-relaxed custom-scrollbar border-none shadow-2xl"
                placeholder="<div class='container'>...</div>"
                value={formData.html_code}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-4">
              <label className="text-[11px] font-bold text-[#2A2A2A] uppercase tracking-[0.3em] pl-1 opacity-40 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div> CSS Styling
              </label>
              <textarea 
                name="css_code"
                rows="6"
                className="w-full bg-[#2A2A2A] rounded-[24px] px-10 py-8 text-indigo-300 font-mono text-sm focus:ring-8 focus:ring-[#00D1B2]/10 outline-none transition-all leading-relaxed custom-scrollbar border-none shadow-2xl"
                placeholder=".container { ... }"
                value={formData.css_code}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-4">
              <label className="text-[11px] font-bold text-[#2A2A2A] uppercase tracking-[0.3em] pl-1 opacity-40 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div> JS Logic
              </label>
              <textarea 
                name="js_code"
                rows="6"
                className="w-full bg-[#2A2A2A] rounded-[24px] px-10 py-8 text-orange-300 font-mono text-sm focus:ring-8 focus:ring-[#00D1B2]/10 outline-none transition-all leading-relaxed custom-scrollbar border-none shadow-2xl"
                placeholder="document.addEventListener(...)"
                value={formData.js_code}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-6 pt-10">
          <button 
            type="button"
            onClick={onCancel}
            className="px-12 py-6 bg-white hover:bg-slate-50 text-slate-500 rounded-[20px] font-bold transition-all border border-slate-100 shadow-sm text-lg"
          >
            キャンセル
          </button>
          <button 
            type="submit"
            className="px-20 py-6 bg-[#00D1B2] hover:opacity-90 text-white rounded-[20px] font-extrabold transition-all shadow-2xl shadow-[#00D1B2]/30 active:scale-95 text-xl flex items-center gap-3"
          >
            <Plus size={24} />
            {snippet ? '更新を保存' : 'スニペットを登録'}
          </button>
        </div>
      </form>
    </div>
  );
}
