

const Closet = () => {
  const [outfits, setOutfits] = React.useState([]);
  const [status, setStatus] = React.useState(localStorage.getItem('outfit_generation_status'));

  const fetchGeneratedOutfits = async () => {
    try {
      const response = await fetch('/public/generated_outfits.json?t=' + new Date().getTime());
      if (response.ok) {
        let generatedData = await response.json();
        
        // Filter out full-body user photos from outfit item images
        generatedData = generatedData.map(outfit => ({
          ...outfit,
          images: outfit.images.filter(img => !img.includes('/public/images/user/'))
        }));
        
        setOutfits(generatedData);
      } else {
        // Fallback to initial data if file doesn't exist yet
        setOutfits(window.OUTFITS_DATA || []);
      }
    } catch (error) {
      console.error('Error fetching generated outfits:', error);
      setOutfits(window.OUTFITS_DATA || []);
    }
  };

  React.useEffect(() => {
    // Initial fetch
    fetchGeneratedOutfits();

    // Poll for status changes and refresh data
    const interval = setInterval(() => {
      const currentStatus = localStorage.getItem('outfit_generation_status');
      
      // If status changed or if it's currently completed, we should check for new data
      if (currentStatus !== status) {
        setStatus(currentStatus);
        fetchGeneratedOutfits();
        if (currentStatus === 'completed') {
          // Clear the status after a short delay so the prompt disappears
          setTimeout(() => {
            localStorage.removeItem('outfit_generation_status');
            setStatus(null);
          }, 3000);
        }
      } else if (currentStatus === 'completed') {
        // If it's already completed, still poll occasionally to ensure we have the latest
        fetchGeneratedOutfits();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className="flex flex-col h-screen bg-[#F2F2F7] dark:bg-black">
      {/* Header - iOS Style */}
      <header className="shrink-0 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl sticky top-0 z-40 px-5 pt-12 pb-4 border-b border-black/[0.05] dark:border-white/[0.05]">
        <div className="flex items-baseline justify-between">
          <div className="flex flex-col">
            <h1 className="text-3xl font-extrabold tracking-tight text-black dark:text-white">Closet</h1>
            <p className="text-[13px] font-medium text-[#8E8E93] mt-0.5">
              {outfits.length} Generated coordinations
            </p>
          </div>
          <a 
            href="generator.html"
            className="text-[#007AFF] font-semibold text-lg active:opacity-50 transition-opacity"
          >
            New
          </a>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {/* Status Messages - iOS Style Inline Banner */}
        {status === 'in_progress' && (
          <div className="mx-4 mt-4 bg-[#007AFF]/10 rounded-2xl p-4 flex items-center gap-4 animate-pulse">
            <div className="size-5 border-2 border-[#007AFF] border-t-transparent rounded-full animate-spin" />
            <p className="text-[15px] font-semibold text-[#007AFF] leading-tight">
              AI is designing your new outfits...
            </p>
          </div>
        )}

        {/* Search - iOS Style */}
        <div className="px-4 mt-6">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93] text-[20px]">search</span>
            <input 
              type="text" 
              placeholder="Search outfits..."
              className="w-full h-11 bg-[#E3E3E8] dark:bg-[#1C1C1E] border-none rounded-xl pl-10 pr-4 text-[17px] focus:ring-2 focus:ring-[#007AFF]/20 placeholder:text-[#8E8E93]"
            />
          </div>
        </div>

        {/* Outfits List */}
        <div className="mt-8 px-4">
          <h2 className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider px-1 mb-4">Latest Designs</h2>
          <div className="space-y-6">
            {outfits.map((outfit) => (
              <div 
                key={outfit.id} 
                className="bg-white dark:bg-[#1C1C1E] rounded-3xl overflow-hidden shadow-sm border border-black/[0.02] dark:border-white/[0.02] active:scale-[0.98] transition-all"
              >
                {/* Image Stack */}
                <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-800">
                  <img 
                    src={outfit.images[0]} 
                    className="w-full h-full object-cover" 
                    alt={outfit.title}
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-[12px] font-bold shadow-sm backdrop-blur-md bg-white/90 dark:bg-black/80 ${outfit.tagColor || 'text-[#007AFF]'}`}>
                      {outfit.tag}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[12px] font-bold shadow-sm backdrop-blur-md bg-[#007AFF]/90 text-white">
                      {outfit.matchPercentage || 95}% Match
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div 
                  className="p-5 cursor-pointer"
                  onClick={() => window.location.href = `outfits.html?id=${outfit.id}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-black dark:text-white leading-tight">
                      {outfit.title}
                    </h3>
                    <div className="flex -space-x-2">
                      {outfit.images.slice(1, 4).map((img, idx) => (
                        <div key={idx} className="size-8 rounded-full border-2 border-white dark:border-[#1C1C1E] overflow-hidden bg-gray-100">
                          <img src={img} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {outfit.images.length > 4 && (
                        <div className="size-8 rounded-full border-2 border-white dark:border-[#1C1C1E] bg-[#F2F2F7] dark:bg-[#2C2C2E] flex items-center justify-center text-[10px] font-bold">
                          +{outfit.images.length - 4}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {outfit.occasions?.map(occ => (
                      <span key={occ} className="px-3 py-1 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg text-[12px] font-semibold text-[#8E8E93]">
                        {occ}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {outfits.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
            <div className="size-20 bg-white dark:bg-[#1C1C1E] rounded-full flex items-center justify-center mb-4 shadow-sm">
              <span className="material-symbols-outlined text-4xl text-[#8E8E93]">auto_awesome</span>
            </div>
            <h3 className="text-xl font-bold mb-2">No outfits yet</h3>
            <p className="text-[#8E8E93] font-medium mb-6">Use the generator to create your first AI-designed look.</p>
            <a 
              href="generator.html"
              className="px-8 py-3 bg-[#007AFF] text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all"
            >
              Start Generating
            </a>
          </div>
        )}
      </main>
    </div>
  );
};

window.Closet = Closet;
