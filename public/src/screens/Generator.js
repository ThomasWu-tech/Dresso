const Generator = () => {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [uploading, setUploading] = React.useState(false);
  const [filter, setFilter] = React.useState('All');
  const [message, setMessage] = React.useState(null);
  const [showFloating, setShowFloating] = React.useState(true);
  const lastScrollY = React.useRef(0);
  const mainRef = React.useRef(null);
  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    fetchItems();
    
    const mainEl = mainRef.current;
    if (!mainEl) return;

    const handleScroll = () => {
      const currentScrollY = mainEl.scrollTop;
      // Only hide if scrolling down significantly and not near the top
      if (currentScrollY > lastScrollY.current && currentScrollY > 200) {
        setShowFloating(false);
      } else {
        setShowFloating(true);
      }
      lastScrollY.current = currentScrollY;
    };

    mainEl.addEventListener('scroll', handleScroll);
    return () => mainEl.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchItems = async () => {
     try {
       const data = await window.api.getClothingItems();
       // Filter out user full-body photos from the items list
       const filteredData = data.filter(item => !item.image.includes('/public/images/user/'));
       setItems(filteredData);
     } catch (error) {
       console.error('Error fetching items:', error);
     } finally {
       setLoading(false);
     }
   };
 
   const handleFileUpload = async (event) => {
     const file = event.target.files[0];
     if (!file) return;
 
     // Check file type
     if (!file.type.startsWith('image/')) {
       setMessage({ type: 'error', text: 'Please upload an image file.' });
       return;
     }
 
     setUploading(true);
     setMessage({ type: 'info', text: 'Analyzing image...' });
 
     try {
       const token = localStorage.getItem('token');
       const data = await window.api.uploadClothing(token, file);
       
       setMessage({ type: 'success', text: `Successfully uploaded to ${data.category}!` });
       fetchItems(); // Refresh list
     } catch (error) {
       setMessage({ type: 'error', text: error.message || 'Upload failed' });
     } finally {
       setUploading(false);
       // Reset file input
       if (fileInputRef.current) fileInputRef.current.value = '';
       
       // Clear message after 3 seconds
       setTimeout(() => setMessage(null), 3000);
     }
   };

  const toggleSelection = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, isSelected: !item.isSelected } : item
    ));
  };

  const filteredItems = items.filter(item => 
    filter === 'All' || item.category === filter
  );

  const selectedCount = items.filter(i => i.isSelected).length;

  const handleGenerateClick = async (e) => {
    e.preventDefault();
    if (selectedCount === 0) return;

    try {
      const token = localStorage.getItem('token');
      // Set a flag in localStorage to indicate generation is in progress
      localStorage.setItem('outfit_generation_status', 'in_progress');
      
      // Navigate to closet page immediately as requested
      window.location.href = "closet.html";

      // Call the generation API in the background (the browser might cancel this on navigation if not careful, 
      // but in this simple setup we'll trigger it. For a more robust app, this would be a background task on the server)
      window.api.generateOutfits(token).then(() => {
        localStorage.setItem('outfit_generation_status', 'completed');
      }).catch(err => {
        console.error('Generation failed:', err);
        localStorage.setItem('outfit_generation_status', 'failed');
      });

    } catch (error) {
      console.error('Error starting generation:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F2F2F7] dark:bg-black">
      {/* Header - iOS Style */}
      <header className="shrink-0 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl sticky top-0 z-40 px-5 pt-12 pb-4 border-b border-black/[0.05] dark:border-white/[0.05]">
        <div className="flex items-baseline justify-between">
          <h1 className="text-3xl font-extrabold tracking-tight text-black dark:text-white">Generator</h1>
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="text-[#007AFF] font-semibold text-lg active:opacity-50 transition-opacity"
          >
            {uploading ? '...' : 'Add'}
          </button>
        </div>
      </header>

      <main ref={mainRef} className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {/* Messages */}
        {message && (
          <div className={`mx-4 mt-4 p-3 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-4 ${
            message.type === 'error' ? 'bg-red-100 text-red-600' : 
            message.type === 'success' ? 'bg-green-100 text-green-600' : 
            'bg-blue-100 text-blue-600'
          }`}>
            {message.text}
          </div>
        )}

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          className="hidden" 
          accept="image/*"
        />

        {/* Categories - iOS Style Horizontal Scroll */}
        <div className="mt-6 px-4">
          <h2 className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider px-1 mb-2">Categories</h2>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {['All', 'Tops', 'Bottoms', 'Shoes', 'Accessories'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-[15px] font-semibold whitespace-nowrap transition-all duration-200 ${
                  filter === cat 
                    ? 'bg-[#007AFF] text-white shadow-sm' 
                    : 'bg-white dark:bg-[#1C1C1E] text-black dark:text-white border border-black/[0.05] dark:border-white/[0.05]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid - iOS Style */}
        <div className="mt-6 px-4">
          <h2 className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider px-1 mb-3">Your Items</h2>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-40">
              <div className="size-8 border-3 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="font-medium">Loading closet...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-8 text-center border border-black/[0.05] dark:border-white/[0.05]">
              <span className="material-symbols-outlined text-4xl text-[#8E8E93] mb-3">checkroom</span>
              <p className="text-[#8E8E93] font-medium">No items found in {filter}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleSelection(item.id)}
                  className={`group relative aspect-[3/4] bg-white dark:bg-[#1C1C1E] rounded-2xl overflow-hidden border-2 transition-all duration-200 active:scale-[0.98] ${
                    item.isSelected 
                      ? 'border-[#007AFF] shadow-lg ring-2 ring-[#007AFF]/20' 
                      : 'border-transparent shadow-sm'
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Selection Overlay */}
                  <div className={`absolute top-2 right-2 size-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    item.isSelected 
                      ? 'bg-[#007AFF] border-[#007AFF] scale-110' 
                      : 'bg-black/20 border-white shadow-sm backdrop-blur-sm'
                  }`}>
                    {item.isSelected && (
                      <span className="material-symbols-outlined text-[16px] text-white font-bold">check</span>
                    )}
                  </div>

                  {/* Info Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8">
                    <p className="text-white text-[13px] font-semibold truncate">{item.name}</p>
                    <p className="text-white/70 text-[11px] font-medium">{item.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button - iOS Style High Elevation */}
      <div className={`fixed bottom-24 inset-x-0 flex justify-center z-50 px-6 transition-all duration-500 transform ${
        showFloating && selectedCount > 0 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-90 pointer-events-none'
      }`}>
        <button
          onClick={handleGenerateClick}
          className="w-full max-w-xs bg-[#007AFF] text-white h-14 rounded-2xl font-bold text-lg shadow-[0_10px_30px_rgba(0,122,255,0.4)] flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined font-bold">auto_awesome</span>
          Generate AI Look
          <span className="bg-white/20 px-2 py-0.5 rounded-lg text-sm tabular-nums">{selectedCount}</span>
        </button>
      </div>
    </div>
  );
};

window.Generator = Generator;
