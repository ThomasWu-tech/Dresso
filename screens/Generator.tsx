import React from 'react';
import { WardrobeItem } from '../types';

const WARDROBE_ITEMS: WardrobeItem[] = [
  { id: 'w1', name: 'White Tee', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3ufdCT2Pwvea-_RI-3Bg7lVNo96iqNmGC3ypQ-tFf7cXDdyIugB02Da--nlqWpLtOdNJnaP1V1MS7MM_U7xHKCRAGBtnaQKkPMBnv7Q_CSH5m5jC_1eZGEoH3CeMqbCqtdGbXrUmGnVItuvDTVdkzB4xIS9nBvjIxWoZVBlv_4pc7BpMmMB6dwk2o24PxSgHq9NtMwvaIx66oGPEyUKtw_lQVkCiY5NdbA5qmh-2ESjF_u5z_0szpRhnfRwgmSayDCV04ZchWJ6M', category: 'Tops', isSelected: true },
  { id: 'w2', name: 'Denim Shorts', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdBzuHnX4YY3K62eGgSy8BrJAlN2HBfZedQnfMpmRoCZZPWZ9IRYYUExqT1IKXCKFDxLQNGvm1x_uNJuNIV6pncKBt4rAwqcckoLGTEnKV3l1nR4YPvpqeLKU2PG1PCNY3OCnwAMoYr-eraHpLFwoCaZpuRRFXPFLyzdnnWGwKkWHudtHHc2DxFPzAnQrrq96K8SSqSkA-0hssfHbmABryAWMv5EQbkSG1R088j5lrSt6oAOOQcJpXMf3ebiNgqdyjm7RLZhj1DAE', category: 'Bottoms', isSelected: false },
  { id: 'w3', name: 'White Kicks', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBraIGNJ0j5uZj5jvIG2QIqZedvmjxsD5LEDvHrSY9rSoXHDD8MtjNH0RiuYUMpcaeXd6H832cpa6zj1M_My8h5OkkEzYAWxmyw6wZqp_kFoQF2hhQi71vOYmhx6NCVFJqazUGW-9eF-v5fuSNvDH1nU9msIsip10hBck_-bWo4iZchd8tFlZIeSE_FTYMKNgbMSMnfFnn22UvL6BKDo9Ebx1cyalwt4M0w2HwZhtTHVCeYmSlaujyPXy8Q-BkKDmd93xIHObrteIk', category: 'Shoes', isSelected: true },
  { id: 'w4', name: 'Leather Jacket', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlVYCuFJivT-Kb7FhUrLgr5me4ecZx3FARu_OAQ86MncocpTYqm6p9FfFrVjzVMg_mqZcK8mHSXZKG3gJ9YLQLr92NB2f9dNjkfzBeNEkuUS66WNorSmY79oy_wK32CY9Pruu8jTTqb9qNI0LY826ug_s3OWoqW5G7DWmBEEmJye9-LxNYboj75GlZX9OoVXccrtXNyNY68S55pL7l4IH7oNC_rIT3t6WababW7oYB_tDQVXVQgjHaJMSxQEGbfR4L_8WUodvHbAM', category: 'Outerwear', isSelected: false },
  { id: 'w5', name: 'Linen Shirt', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFPDKoxBZSVP75QE49ifJZJu0SODTjUNtSrG4rNkEXnjVRy1dvkl6hkVrGSdZVyLQ1M3E5ALnjoU29xLEXCf0DuCb9PG8V-c9_OBkjnLOsDmfFdW3dY3An7PCGCq6n_lH_S09GmqV8no3lN43YhinyvbbVuh2oCJj9PIvyJ841yPRnMqdVpkq-AMKquzUbQwpXddtebnO30BqF9Ln7MDrR4GbggcLzF76qssWDW9WidBdRC7Io2r6OkhjdslW7HmegvhXDEULBOXE', category: 'Tops', isSelected: false },
  { id: 'w6', name: 'Blue Runners', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGrBdAlkrzkDiZW375Ig-wmTdFFd66d-nU4k5q7MzrokV0x6O3ZRNwbDA59Vjx7mv4FRMvNbIipyr6ptFo4EnDABplti27zJfGHnW9ngMRLyVJe_lyn69KqcYkjjvKnWdNrIOhr8kr-Mmh5B6KqyFatrJDLrFm9WxqVhpNx_e-Kx59Jiy7whnk8hZyHbBknNsf9DzKMOLePGF_Txm76mVqgrRooCU5P24WGXwV4eyVJbAc19pOZUDFsPXXNSQlifPzfOGCKVrTrPE', category: 'Shoes', isSelected: false },
];

const Generator: React.FC = () => {
  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto shadow-2xl bg-background-light dark:bg-background-dark pb-32">
       {/* Header */}
       <header className="flex items-center justify-between p-4 sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <button className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-surface-light dark:hover:bg-surface-dark transition-colors">
          <span className="material-symbols-outlined text-slate-900 dark:text-white" style={{ fontSize: '24px' }}>arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-bold leading-tight">Outfit Creator</h1>
        <div className="size-10"></div> 
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="px-5 pt-2 pb-4">
          <h2 className="text-2xl font-bold leading-tight mb-2">Mix & Match</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Select items from your closet to generate a new look.</p>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-3 px-5 pb-6 overflow-x-auto no-scrollbar">
          {['All', 'Tops', 'Bottoms', 'Shoes', 'Outerwear'].map((filter, idx) => (
             <button
             key={filter}
             className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-all active:scale-95 ${
               idx === 0
               ? 'bg-primary shadow-lg shadow-primary/20 text-white font-semibold'
               : 'bg-surface-light dark:bg-surface-dark border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300 font-medium'
             }`}
           >
             <span className="text-sm">{filter}</span>
           </button>
          ))}
        </div>

        {/* Add Item Button */}
        <div className="px-5 mb-6">
          <button className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 py-8 transition-colors hover:border-primary/50 hover:bg-primary/5 active:bg-primary/10 group">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>add_a_photo</span>
            </div>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">Add New Item</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Upload from gallery or camera</span>
          </button>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-2 gap-4 px-5 pb-6">
          {WARDROBE_ITEMS.map((item) => (
            <div
              key={item.id}
              className={`group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-xl bg-surface-light dark:bg-surface-dark transition-all ${
                item.isSelected
                ? 'ring-2 ring-primary ring-offset-2 ring-offset-background-light dark:ring-offset-background-dark'
                : 'hover:ring-2 hover:ring-primary/50 hover:ring-offset-2 hover:ring-offset-background-light dark:hover:ring-offset-background-dark'
              }`}
            >
              <div className={`absolute right-2 top-2 z-10 flex size-6 items-center justify-center rounded-full transition-all ${
                  item.isSelected
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-black/20 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 group-hover:bg-primary'
              }`}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{item.isSelected ? 'check' : 'add'}</span>
              </div>
              <div
                className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url("${item.image}")` }}
              ></div>
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/60 to-transparent p-3 pt-8">
                <p className="text-xs font-medium text-white">{item.name}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-[65px] left-0 z-30 w-full bg-white/90 dark:bg-background-dark/90 px-5 py-4 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-500 dark:text-slate-400">Selected Items</span>
          <span className="font-bold text-primary">2 items</span>
        </div>
        <button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-white shadow-lg shadow-primary/30 transition-all hover:bg-blue-600 active:scale-[0.98]">
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>auto_awesome</span>
          <span className="font-semibold text-base">Generate AI Look</span>
        </button>
      </div>

    </div>
  );
};

export default Generator;
