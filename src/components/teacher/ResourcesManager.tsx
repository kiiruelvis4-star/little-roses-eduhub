import React, { useState } from 'react';
import { 
  ResourceItem, 
  GradeLevel, 
  SubjectName, 
  STANDARD_SUBJECTS 
} from '../../types';
import { 
  FolderOpen, 
  Plus, 
  FileText, 
  Download, 
  Trash2, 
  Search, 
  ExternalLink, 
  FileCheck, 
  Sparkles,
  BookOpen,
  Film,
  UploadCloud
} from 'lucide-react';
import { storage } from '../../services/storageService';

interface ResourcesManagerProps {
  resources: ResourceItem[];
  onOpenUploadModal: () => void;
}

const GRADES: GradeLevel[] = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];
const CATEGORIES = ['All', 'Textbook', 'Revision Paper', 'Teaching Aid', 'Lesson Notes', 'Video Guide'] as const;

export const ResourcesManager: React.FC<ResourcesManagerProps> = ({
  resources,
  onOpenUploadModal
}) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'All'>('All');
  const [selectedSubject, setSelectedSubject] = useState<SubjectName | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = resources.filter(r => {
    const matchesGrade = selectedGrade === 'All' || r.grade === selectedGrade;
    const matchesSub = selectedSubject === 'All' || r.subject === selectedSubject;
    const matchesCat = selectedCategory === 'All' || r.category === selectedCategory;
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGrade && matchesSub && matchesCat && matchesSearch;
  });

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Remove resource "${title}"?`)) {
      storage.deleteResource(id);
    }
  };

  const handleSimulatedDownload = (res: ResourceItem) => {
    alert(`Downloading Little Roses Academy Resource:\n"${res.title}" (${res.fileSize})`);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading">
            CBC Teaching Aids & Digital Resources
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Upload curriculum designs, schemes templates, past exams, and revision materials.
          </p>
        </div>

        <button
          onClick={onOpenUploadModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
        >
          <UploadCloud className="w-4 h-4" />
          Upload Resource
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search resource title or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
            >
              <option value="All">All Grades (1 - 6)</option>
              {GRADES.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
            >
              <option value="All">All Subjects</option>
              {STANDARD_SUBJECTS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category horizontal pill strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
          <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-base font-bold text-slate-700 dark:text-slate-300">No resources found</p>
          <p className="text-xs text-slate-500 mt-1">Click "Upload Resource" to add teaching aids or revision guides.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-extrabold text-xs">
                      {item.grade}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs">
                      {item.subject}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                      {item.category}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono font-bold text-slate-400">
                    {item.fileSize}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{item.title}</span>
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Added: {item.uploadedAt}</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSimulatedDownload(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-xs"
                    title="Delete Resource"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
