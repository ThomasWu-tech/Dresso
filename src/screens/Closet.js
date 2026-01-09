

const Closet = () => {
  const outfits = window.OUTFITS_DATA || [];
  return (
    <div className="relative min-h-screen flex flex-col pb-28 bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-[#0d121b] dark:text-white">Closet</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">24 Saved coordinations</p>
        </div>
        <a href="generator.html" className="flex items-center justify-center w-10 h-10 bg-white dark:bg-[#1e2736] text-[#0d121b] dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm active:scale-95 transition-all hover:border-primary hover:text-primary">
          <span className="material-symbols-outlined">add</span>
        </a>
      </header>

      {/* Search & Filters */}
      <div className="sticky top-[73px] z-30 bg-background-light dark:bg-background-dark pt-3 pb-2 shadow-sm dark:shadow-none">
        <div className="px-4 mb-3">
            <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
                <input 
                    type="text" 
                    placeholder="Search outfits..." 
                    className="w-full bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
            </div>
        </div>
        <div className="flex px-4 gap-2 overflow-x-auto no-scrollbar pb-2">
            <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#135bec] text-white text-xs font-semibold shadow-md shadow-blue-500/20 whitespace-nowrap">
                All
            </button>
            <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-800 whitespace-nowrap transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                Warm
            </button>
            <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-800 whitespace-nowrap transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                Work
            </button>
            <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-800 whitespace-nowrap transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                Relaxed
            </button>
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="px-3 pt-2">
        <div className="columns-2 gap-3 space-y-3">
          {outfits.map((outfit) => (
            <div
              key={outfit.id}
              onClick={() => window.location.href = `outfits.html?id=${outfit.id}`}
              className="break-inside-avoid relative group rounded-xl overflow-hidden bg-white dark:bg-card-dark shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all cursor-pointer"
            >
              {/* Image Stack */}
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-800">
                <div className="absolute inset-0 grid grid-rows-2 gap-0.5">
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${outfit.images[0]}')` }}></div>
                    <div className="grid grid-cols-2 gap-0.5">
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${outfit.images[1]}')` }}></div>
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${outfit.images[2]}')` }}></div>
                    </div>
                </div>
                {outfit.isFavorite && (
                    <div className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[14px] text-red-500 fill-1">favorite</span>
                    </div>
                )}
                {outfit.description && (
                     <div className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded-md bg-white/90 dark:bg-black/60 backdrop-blur-sm shadow-sm">
                        <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200">{outfit.description}</span>
                    </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{outfit.title}</h3>
                </div>
                <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-semibold uppercase tracking-wide ${outfit.tagColor}`}>{outfit.tag}</span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{outfit.itemCount} items</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

window.Closet = Closet;
