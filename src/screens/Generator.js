const Generator = () => {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [uploading, setUploading] = React.useState(false);
  const [filter, setFilter] = React.useState('All');
  const [message, setMessage] = React.useState(null);
  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
     try {
       const data = await window.api.getClothingItems();
       setItems(data);
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

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto shadow-2xl bg-background-light dark:bg-background-dark pb-32">
       {/* Header */}
       <header className="sticky top-0 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-[#0d121b] dark:text-white">Outfit Creator</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">Mix & match from your closet</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pt-2">
        {/* Filter Chips */}
        <div className="flex gap-3 px-5 pb-6 overflow-x-auto no-scrollbar">
          {['All', 'Tops', 'Bottoms', 'Shoes', 'Accessories'].map((f) => (
             <button
             key={f}
             onClick={() => setFilter(f)}
             className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-all active:scale-95 ${
               filter === f
               ? 'bg-primary shadow-lg shadow-primary/20 text-white font-semibold'
               : 'bg-surface-light dark:bg-surface-dark border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300 font-medium'
             }`}
           >
             <span className="text-sm">{f}</span>
           </button>
          ))}
        </div>

        {/* Status Message */}
        {message && (
          <div className={`mx-5 mb-4 p-3 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300 ${
            message.type === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
            message.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
          }`}>
            <div className="flex items-center gap-2">
              {uploading && <div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
              {message.text}
            </div>
          </div>
        )}

        {/* Add Item Button */}
        <div className="px-5 mb-6">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept="image/*"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 py-8 transition-colors hover:border-primary/50 hover:bg-primary/5 active:bg-primary/10 group disabled:opacity-50"
          >
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>
                {uploading ? 'sync' : 'add_a_photo'}
              </span>
            </div>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              {uploading ? 'Uploading...' : 'Add New Item'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Upload from gallery or camera</span>
          </button>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 px-5 pb-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleSelection(item.id)}
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
                  <p className="text-[10px] text-white/70">{item.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredItems.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
            <span className="material-symbols-outlined text-slate-300 dark:text-slate-700" style={{ fontSize: '64px' }}>checkroom</span>
            <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">No items found in this category.</p>
          </div>
        )}
      </main>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-[65px] left-0 z-30 w-full bg-white/90 dark:bg-background-dark/90 px-5 py-4 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-500 dark:text-slate-400">Selected Items</span>
          <span className="font-bold text-primary">{selectedCount} items</span>
        </div>
        <a 
          href={selectedCount > 0 ? "outfits.html" : "#"} 
          onClick={(e) => selectedCount === 0 && e.preventDefault()}
          className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-white shadow-lg shadow-primary/30 transition-all hover:bg-blue-600 active:scale-[0.98] ${selectedCount === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>auto_awesome</span>
          <span className="font-semibold text-base">Generate AI Look</span>
        </a>
      </div>

    </div>
  );
};

window.Generator = Generator;
