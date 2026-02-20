const Profile = () => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editForm, setEditForm] = React.useState({ username: '', password: '', height: '', weight: '' });
  const [avatarLoading, setAvatarLoading] = React.useState(false);
  const [photoLoading, setPhotoLoading] = React.useState(false);
  const [showPhotoViewer, setShowPhotoViewer] = React.useState(false);
  const fileInputRef = React.useRef(null);
  const photoInputRef = React.useRef(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = 'login.html';
        return;
      }

      try {
        const userData = await window.api.getMe(token);
        setUser(userData);
        setEditForm({ 
          username: userData.username, 
          password: '',
          height: userData.height || '',
          weight: userData.weight || ''
        });
      } catch (err) {
        console.error(err);
        localStorage.removeItem('token');
        window.location.href = 'login.html';
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const updatedUser = await window.api.updateProfile(token, {
        username: editForm.username,
        password: editForm.password || undefined,
        height: editForm.height ? parseInt(editForm.height) : null,
        weight: editForm.weight ? parseInt(editForm.weight) : null
      });
      setUser(updatedUser);
      setIsEditing(false);
      setEditForm(prev => ({ ...prev, password: '' })); // Clear password
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoClick = () => {
    photoInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarLoading(true);
    const token = localStorage.getItem('token');
    try {
      const result = await window.api.uploadAvatar(token, file);
      setUser(prev => ({ ...prev, avatar_url: result.avatar_url }));
    } catch (err) {
      alert(err.message);
    } finally {
      setAvatarLoading(false);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoLoading(true);
    const token = localStorage.getItem('token');
    try {
      const result = await window.api.uploadUserPhoto(token, file);
      setUser(prev => ({ ...prev, photo_url: result.photo_url }));
    } catch (err) {
      alert(err.message);
    } finally {
      setPhotoLoading(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden pb-24 bg-[#F2F2F7] dark:bg-black">
      {/* Header */}
      <header className="shrink-0 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl sticky top-0 z-40 px-5 pt-12 pb-4 border-b border-black/[0.05]">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold tracking-tight text-black dark:text-white">Profile</h1>
          <button 
            onClick={handleLogout}
            className="text-[#007AFF] font-medium text-lg"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-col items-center px-4 py-6 gap-6">
        {/* Profile Info */}
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-28 w-28 ring-4 ring-white dark:ring-[#1C1C1E] shadow-xl"
              style={{
                backgroundImage: `url("${user.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBULEEeCRVSIq56NcLpf54z6Wn62Yfnx7W3G0v1ThbHinMkt1Gs9_o1J0r0CEbli2s24SQqFg3s8Rxi-a3okAlPJzdxxzvnoWnOUk4rFpsO7lEeQJS7RkEZZJE1ESgnH7DbhHGiUVCKXSuv59eOFQCL9u72jlhCGZi0HKlkvibgq79ikjhlsXcXAVLL-zIkQprGel0YZah7925Rmhbg9nzpwaemWbZefAkJVXnO_GFCI1ERcizexVqF4ripXf34-ulEKZlRr9pUrDI'}")`,
                opacity: avatarLoading ? 0.5 : 1
              }}
            ></div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {!isEditing ? (
            <>
              <div className="flex flex-col items-center text-center gap-1">
                <h2 className="text-black dark:text-white text-2xl font-bold tracking-tight">{user.username}</h2>
                <p className="text-[#8E8E93] text-sm font-medium">{user.email || 'No email set'}</p>
              </div>

              {/* iOS Inset Grouped List Style for Stats */}
              <div className="w-full px-1">
                <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-sm overflow-hidden divide-y divide-black/[0.05] dark:divide-white/[0.05]">
                  <div className="flex items-center justify-between p-4">
                    <span className="text-black dark:text-white font-medium">Height</span>
                    <span className="text-[#8E8E93]">{user.height ? `${user.height} cm` : '--'}</span>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <span className="text-black dark:text-white font-medium">Weight</span>
                    <span className="text-[#8E8E93]">{user.weight ? `${user.weight} kg` : '--'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 w-full px-1">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-white dark:bg-[#1C1C1E] text-[#007AFF] rounded-2xl h-12 font-semibold shadow-sm transition-all active:opacity-70"
                >
                  Edit Profile
                </button>
                <div className="flex gap-3">
                  <button 
                    onClick={handlePhotoClick}
                    disabled={photoLoading}
                    className="flex-1 bg-white dark:bg-[#1C1C1E] text-[#007AFF] rounded-2xl h-12 font-semibold shadow-sm transition-all active:opacity-70 disabled:opacity-50"
                  >
                    {photoLoading ? 'Uploading...' : (user.photo_url ? 'Update Photo' : 'Add Photo')}
                  </button>
                  {user.photo_url && (
                    <button 
                      onClick={() => setShowPhotoViewer(true)}
                      className="flex-1 bg-white dark:bg-[#1C1C1E] text-[#007AFF] rounded-2xl h-12 font-semibold shadow-sm transition-all active:opacity-70"
                    >
                      View Photo
                    </button>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={photoInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </div>
            </>
          ) : (
            <form onSubmit={handleEditSubmit} className="w-full px-1 space-y-4">
              <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-sm overflow-hidden divide-y divide-black/[0.05] dark:divide-white/[0.05]">
                <div className="px-4 py-3">
                  <label className="block text-[10px] uppercase font-semibold text-[#8E8E93] mb-1">Username</label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                    className="w-full bg-transparent text-black dark:text-white focus:outline-none"
                  />
                </div>
                <div className="px-4 py-3">
                  <label className="block text-[10px] uppercase font-semibold text-[#8E8E93] mb-1">New Password</label>
                  <input
                    type="password"
                    value={editForm.password}
                    onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                    placeholder="Optional"
                    className="w-full bg-transparent text-black dark:text-white focus:outline-none"
                  />
                </div>
                <div className="flex divide-x divide-black/[0.05] dark:divide-white/[0.05]">
                  <div className="flex-1 px-4 py-3">
                    <label className="block text-[10px] uppercase font-semibold text-[#8E8E93] mb-1">Height (cm)</label>
                    <input
                      type="number"
                      value={editForm.height}
                      onChange={(e) => setEditForm({...editForm, height: e.target.value})}
                      className="w-full bg-transparent text-black dark:text-white focus:outline-none"
                    />
                  </div>
                  <div className="flex-1 px-4 py-3">
                    <label className="block text-[10px] uppercase font-semibold text-[#8E8E93] mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      value={editForm.weight}
                      onChange={(e) => setEditForm({...editForm, weight: e.target.value})}
                      className="w-full bg-transparent text-black dark:text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#007AFF] text-white rounded-2xl h-12 font-semibold shadow-lg shadow-[#007AFF]/20 active:opacity-90"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-white dark:bg-[#1C1C1E] text-black dark:text-white rounded-2xl h-12 font-semibold shadow-sm active:opacity-70"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="px-5 pb-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-4 shadow-sm text-center">
            <span className="block text-2xl font-bold text-black dark:text-white">42</span>
            <span className="text-[10px] uppercase font-bold text-[#8E8E93] tracking-wider">Items</span>
          </div>
          <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-4 shadow-sm text-center">
            <span className="block text-2xl font-bold text-black dark:text-white">15</span>
            <span className="text-[10px] uppercase font-bold text-[#8E8E93] tracking-wider">Outfits</span>
          </div>
          <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-4 shadow-sm text-center">
            <span className="block text-2xl font-bold text-[#007AFF]">98%</span>
            <span className="text-[10px] uppercase font-bold text-[#8E8E93] tracking-wider">Score</span>
          </div>
        </div>
      </div>

      {/* Wardrobe Lists */}
      <div className="px-5 mb-8">
        <h3 className="text-[#8E8E93] text-[13px] font-medium uppercase tracking-wider mb-2 px-1">My Wardrobe</h3>
        <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-sm overflow-hidden divide-y divide-black/[0.05] dark:divide-white/[0.05]">
          <div className="flex items-center p-4 active:bg-gray-100 dark:active:bg-gray-800 transition-colors group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#007AFF]/10 text-[#007AFF] mr-3">
              <span className="material-symbols-outlined text-[20px]">checkroom</span>
            </div>
            <div className="flex-1">
              <h4 className="text-black dark:text-white font-semibold text-[15px]">Clothes</h4>
              <p className="text-[#8E8E93] text-[12px]">28 items</p>
            </div>
            <span className="material-symbols-outlined text-[#C7C7CC] text-[20px]">chevron_right</span>
          </div>
          <div className="flex items-center p-4 active:bg-gray-100 dark:active:bg-gray-800 transition-colors group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#5856D6]/10 text-[#5856D6] mr-3">
              <span className="material-symbols-outlined text-[20px]">styler</span>
            </div>
            <div className="flex-1">
              <h4 className="text-black dark:text-white font-semibold text-[15px]">Accessories</h4>
              <p className="text-[#8E8E93] text-[12px]">14 items</p>
            </div>
            <span className="material-symbols-outlined text-[#C7C7CC] text-[20px]">chevron_right</span>
          </div>
        </div>
      </div>

      {/* Photo Viewer Modal */}
      {showPhotoViewer && user.photo_url && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black animate-in fade-in duration-300">
          <div className="flex items-center justify-between px-4 pt-12 pb-4">
            <h3 className="text-white font-bold text-lg">Full Body Photo</h3>
            <button 
              onClick={() => setShowPhotoViewer(false)}
              className="text-[#007AFF] font-medium text-lg"
            >
              Done
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <img src={user.photo_url} alt="Full body" className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
};

window.Profile = Profile;
