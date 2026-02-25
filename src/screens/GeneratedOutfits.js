const GeneratedOutfits = () => {
  const [outfit, setOutfit] = React.useState(null);
  const [isFavorite, setIsFavorite] = React.useState(false);

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const allOutfits = window.OUTFITS_DATA || [];
    
    if (id) {
      const selectedOutfit = allOutfits.find(o => o.id === id);
      if (selectedOutfit) {
        setOutfit(selectedOutfit);
        setIsFavorite(selectedOutfit.isFavorite || false);
      }
    }
  }, []);

  if (!outfit) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background-light dark:bg-background-dark">
        <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">style</span>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Outfit Not Found</h2>
        <p className="text-gray-500 text-center mb-6">Please select an outfit from your closet.</p>
        <button 
          onClick={() => window.location.href = 'closet.html'}
          className="px-6 py-2 bg-primary text-white rounded-full font-medium"
        >
          Go to Closet
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col w-full max-w-md mx-auto min-h-screen bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden pb-10">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-4 py-3 flex items-center gap-4 border-b border-gray-200/50 dark:border-gray-800/50">
        <button 
          onClick={() => window.location.href = 'closet.html'}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="material-symbols-outlined text-gray-700 dark:text-gray-300">arrow_back</span>
        </button>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-[#0d121b] dark:text-white">{outfit.title}</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">{outfit.tag} Look</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          <article className="bg-card-light dark:bg-card-dark rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800/50">
            {/* Main Image */}
            <div className="relative w-full aspect-[4/5] bg-slate-100 dark:bg-slate-800 group">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${outfit.images[0]}')` }}></div>
              <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                <span className="material-symbols-outlined text-green-500 text-[18px]">auto_awesome</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">{outfit.matchPercentage || 95}% Match</span>
              </div>
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <button 
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`w-9 h-9 flex items-center justify-center rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm shadow-sm transition-colors ${isFavorite ? 'text-red-500' : 'text-slate-400'}`}
                >
                  <span className={`material-symbols-outlined text-[20px] ${isFavorite ? 'fill-1' : ''}`}>favorite</span>
                </button>
                <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm shadow-sm text-slate-700 dark:text-white hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">ios_share</span>
                </button>
              </div>
            </div>

            {/* Details */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{outfit.title}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{outfit.description}</p>
                </div>
              </div>

              <div className="h-px w-full bg-slate-100 dark:bg-slate-800 my-4"></div>

              {/* Items in this outfit */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Outfit Items</h3>
                <div className="grid grid-cols-3 gap-3">
                  {outfit.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-100 dark:border-slate-700">
                      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${img}')` }}></div>
                    </div>
                  ))}
                </div>
              </div>

              {outfit.accessories && outfit.accessories.length > 0 && (
                <div className="space-y-4 mt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Recommended Accessories</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {outfit.accessories.map((acc) => (
                      <div key={acc.id} className="flex flex-col gap-2 group cursor-pointer">
                        <div className="relative aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-100 dark:border-slate-700">
                          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${acc.image}')` }}></div>
                          <div className={`absolute bottom-1 right-1 p-1 rounded-md shadow-sm ${acc.type === 'shopping' ? 'bg-primary' : 'bg-white dark:bg-slate-900'}`}>
                            <span className={`material-symbols-outlined text-[12px] ${acc.type === 'shopping' ? 'text-white' : 'text-primary'}`}>
                              {acc.type === 'shopping' ? 'shopping_bag' : 'checkroom'}
                            </span>
                          </div>
                        </div>
                        <p className="text-[10px] font-medium text-slate-700 dark:text-slate-300 truncate">{acc.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
        </div>
      </main>
    </div>
  );
};

window.GeneratedOutfits = GeneratedOutfits;
