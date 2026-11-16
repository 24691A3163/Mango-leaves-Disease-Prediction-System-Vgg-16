import React, { useState } from 'react';
import { MANGO_DISEASES } from '../utils/diseaseData';
import { DiseaseCard } from '../components/DiseaseCard';
import { BookOpen, Search, Info, Filter } from 'lucide-react';

interface DiseaseInfoPageProps {
  predictedClass?: string | null;
  classNames: string[];
}

export const DiseaseInfoPage: React.FC<DiseaseInfoPageProps> = ({
  predictedClass,
  classNames,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Ensure we use class names from class_names.json
  const activeClassList = classNames.length > 0 ? classNames : Object.keys(MANGO_DISEASES);

  const categories = ['All', 'Fungal', 'Bacterial', 'Pest', 'Normal'];

  const filteredDiseases = activeClassList
    .map((name) => MANGO_DISEASES[name])
    .filter((disease) => {
      if (!disease) return false;
      const matchesSearch =
        disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disease.scientificName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disease.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || disease.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
            Educational Compendium
          </span>
          <span className="text-xs text-slate-400">• 8 Mango Leaf Categories</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Mango Leaf Pathology &amp; Disease Guide
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed max-w-3xl">
          Comprehensive scientific descriptions, causal organisms, identifiable symptoms, and field management strategies for all 8 mango foliar classes recognized by our VGG16 model.
        </p>
      </div>

      {/* Explicit Disclaimer Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/80 border border-blue-200 text-blue-900 text-xs sm:text-sm flex items-start gap-3.5 shadow-xs">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold">Educational &amp; Reference Material Disclaimer:</span>
          <p className="text-blue-800/90 leading-relaxed text-xs">
            The botanical information, chemical dosages, and cultural practices described on this page are general agricultural knowledge compiled for reference purposes. They represent educational insights into mango agronomy and are completely independent of any individual AI prediction run by the VGG16 vision classifier. Always verify localized treatments with certified agricultural extension officers.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search symptoms, pathogens, or disease name..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1 mr-1 hidden sm:block" />
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Disease Cards List */}
      <div className="space-y-4">
        {filteredDiseases.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold">No diseases match your search criteria.</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting the filter or search term.</p>
          </div>
        ) : (
          filteredDiseases.map((disease) => {
            const isDetectedMatch = predictedClass === disease.name;
            return (
              <DiseaseCard
                key={disease.id}
                disease={disease}
                isPredicted={isDetectedMatch}
                defaultExpanded={isDetectedMatch}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
