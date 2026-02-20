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
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#F2F2F7] dark:bg-black">
        <span className="material-symbols-outlined text-6xl text-[#C7C7CC] mb-4">style</span>
        <h2 className="text-xl font-bold text-black dark:text-white mb-2">Outfit Not Found</h2>
        <p className="text-[#8E8E93] text-center mb-6">Please select an outfit from your closet.</p>
        <button 
          onClick={() => window.location.href = 'closet.html'}
          className="px-8 py-3 bg-[#007AFF] text-white rounded-2xl font-semibold shadow-lg shadow-[#007AFF]/20"
        >
          Go to Closet
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col w-full min-h-screen bg-[#F2F2F7] dark:bg-black overflow-hidden pb-24">
      {/* Header */}
      <header className="shrink-0 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl sticky top-0 z-40 px-4 pt-12 pb-4 border-b border-black/[0.05]">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => window.location.href = 'closet.html'}
            className="flex items-center text-[#007AFF] font-medium text-lg"
          >
            <span className="material-symbols-outlined mr-1">chevron_left</span>
            Back
          </button>
          <h1 className="text-lg font-bold text-black dark:text-white absolute left-1/2 -translate-x-1/2">Outfit Details</h1>
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className={`flex items-center ${isFavorite ? 'text-red-500' : 'text-[#007AFF]'} font-medium text-lg`}
          >
            <span className={`material-symbols-outlined ${isFavorite ? 'fill-1' : ''}`}>
              {isFavorite ? 'favorite' : 'favorite'}
            </span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Main Card */}
          <article className="bg-white dark:bg-[#1C1C1E] rounded-3xl overflow-hidden shadow-sm border border-black/[0.02] dark:border-white/[0.02]">
            {/* Main Image */}
            <div className="relative w-full aspect-[4/5] bg-gray-100 dark:bg-gray-900">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${outfit.images[0]}')` }}></div>
              <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-xl px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                <span className="material-symbols-outlined text-[#34C759] text-[18px]">auto_awesome</span>
                <span className="text-[13px] font-bold text-black dark:text-white">{outfit.matchPercentage || 95}% Match</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="mb-6">
                <h2 className="text-2xl font-extrabold tracking-tight text-black dark:text-white mb-2">{outfit.title}</h2>
                <p className="text-[#8E8E93] text-[15px] leading-relaxed mb-4">{outfit.description}</p>
                {outfit.occasions && (
                  <div className="flex flex-wrap gap-2">
                    {outfit.occasions.map((occasion, idx) => (
                      <span key={idx} className="px-3 py-1 bg-[#F2F2F7] dark:bg-black text-[#8E8E93] text-[11px] font-bold rounded-lg uppercase tracking-wider">
                        {occasion}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Items Section */}
              <div className="space-y-4">
                <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#8E8E93] px-1">Outfit Items</h3>
                <div className="grid grid-cols-3 gap-3">
                  {outfit.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl bg-[#F2F2F7] dark:bg-black overflow-hidden shadow-inner">
                      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${img}')` }}></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accessories Section */}
              {outfit.accessories && outfit.accessories.length > 0 && (
                <div className="space-y-4 mt-8">
                  <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#8E8E93] px-1">Recommended Accessories</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {outfit.accessories.map((acc) => (
                      <div key={acc.id} className="flex flex-col gap-2">
                        <div className="relative aspect-square rounded-2xl bg-[#F2F2F7] dark:bg-black overflow-hidden shadow-inner">
                          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${acc.image}')` }}></div>
                          <div className={`absolute bottom-2 right-2 p-1.5 rounded-lg shadow-sm ${acc.type === 'shopping' ? 'bg-[#007AFF]' : 'bg-white dark:bg-[#1C1C1E]'}`}>
                            <span className={`material-symbols-outlined text-[14px] ${acc.type === 'shopping' ? 'text-white' : 'text-[#007AFF]'}`}>
                              {acc.type === 'shopping' ? 'shopping_bag' : 'checkroom'}
                            </span>
                          </div>
                        </div>
                        <p className="text-[11px] font-semibold text-black dark:text-white truncate px-1">{acc.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>

          {/* Share Action */}
          <button className="w-full bg-white dark:bg-[#1C1C1E] text-[#007AFF] rounded-2xl h-14 font-bold shadow-sm flex items-center justify-center gap-2 active:opacity-70 transition-all">
            <span className="material-symbols-outlined">ios_share</span>
            Share Outfit
          </button>
        </div>
      </main>
    </div>
  );
};

window.GeneratedOutfits = GeneratedOutfits;
