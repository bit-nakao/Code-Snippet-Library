import React from 'react';
import { Search } from 'lucide-react';

export default function Header({ searchTerm, setSearchTerm }) {
  return (
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
  );
}
