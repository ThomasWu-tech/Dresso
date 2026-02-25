const Profile = () => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editForm, setEditForm] = React.useState({ username: '', password: '' });
  const [avatarLoading, setAvatarLoading] = React.useState(false);
  const fileInputRef = React.useRef(null);

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
        setEditForm({ username: userData.username, password: '' });
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
        password: editForm.password || undefined
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

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden pb-24 bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer text-gray-900 dark:text-white"></div>
          <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Profile</h2>
          <div 
            className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            onClick={handleLogout}
          >
            <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">logout</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center px-4 py-6 gap-6">
        {/* Profile Info */}
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-28 w-28 ring-4 ring-white dark:ring-gray-800 shadow-lg"
              style={{
                backgroundImage: `url("${user.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBULEEeCRVSIq56NcLpf54z6Wn62Yfnx7W3G0v1ThbHinMkt1Gs9_o1J0r0CEbli2s24SQqFg3s8Rxi-a3okAlPJzdxxzvnoWnOUk4rFpsO7lEeQJS7RkEZZJE1ESgnH7DbhHGiUVCKXSuv59eOFQCL9u72jlhCGZi0HKlkvibgq79ikjhlsXcXAVLL-zIkQprGel0YZah7925Rmhbg9nzpwaemWbZefAkJVXnO_GFCI1ERcizexVqF4ripXf34-ulEKZlRr9pUrDI'}")`,
                opacity: avatarLoading ? 0.5 : 1
              }}
            ></div>
            <div className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full ring-2 ring-white dark:ring-gray-800 shadow-md flex items-center justify-center hover:bg-blue-600 transition-colors">
              <span className="material-symbols-outlined text-[18px]">edit</span>
            </div>
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
                <h1 className="text-gray-900 dark:text-white text-2xl font-bold leading-tight">{user.username}</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{user.email || 'No email set'}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary dark:text-blue-300">
                    Fashion Enthusiast
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center w-full max-w-[200px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg h-9 px-4 text-sm font-semibold shadow-sm transition-all"
              >
                Edit Profile
              </button>
            </>
          ) : (
            <form onSubmit={handleEditSubmit} className="w-full max-w-sm space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 border bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password (optional)</label>
                <input
                  type="password"
                  value={editForm.password}
                  onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                  placeholder="Leave blank to keep current"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white rounded-lg py-2 text-sm font-semibold hover:bg-primary/90"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-200 text-gray-800 rounded-lg py-2 text-sm font-semibold hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 pb-6">
        <div className="flex gap-3 justify-between">
          <div className="flex flex-1 flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-700">
            <span className="text-gray-900 dark:text-white text-xl font-bold">42</span>
            <span className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide mt-1">Items</span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-700">
            <span className="text-gray-900 dark:text-white text-xl font-bold">15</span>
            <span className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide mt-1">Outfits</span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-1">
              <span className="text-gray-900 dark:text-white text-xl font-bold">98</span>
              <span className="text-primary text-sm font-bold">%</span>
            </div>
            <span className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide mt-1">Style Score</span>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="px-4 mb-8">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 shadow-lg">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-primary/20 blur-2xl"></div>
          <div className="flex items-center justify-between p-5 relative z-10">
            <div className="flex flex-col gap-2 max-w-[60%]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-yellow-400 text-lg">diamond</span>
                <p className="text-white text-base font-bold">Go Premium</p>
              </div>
              <p className="text-gray-300 text-sm leading-snug">Get unlimited AI outfit generations and advanced analytics.</p>
              <button className="mt-2 w-fit bg-primary hover:bg-blue-600 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors">
                Upgrade Now
              </button>
            </div>
            <div
              className="h-24 w-24 bg-center bg-cover rounded-lg shadow-inner"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA0f_DCDeHvOhYg1m61yeAk2zRLyn0npt-7WNWTYUE2XSd4rEwaFPdKLpr9xVeRo6ncfDDo2pwFgdQQ8JRrEDMPn8WOOB4GgeqoIZH3GjaewOwhS-NoNcCSwKFpJaXhzsnuFVQFAfSmZp2H_teByNSpPSaTDLuv21Z8fSXlNiFr0XL33MDJSwnLvZESI6vPnok2c8iDYB2xmZlo8F2F2EDV9dFh1jSZMJVtQ6gwpDasVArYnovWf9po_flH4FtTuJz0c45pkMNPtuE")',
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Wardrobe Lists */}
      <div className="px-4 mb-6">
        <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-3 px-1">My Wardrobe</h3>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden divide-y divide-gray-100 dark:divide-gray-700">
          <div className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-primary mr-3 group-hover:bg-primary group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">checkroom</span>
            </div>
            <div className="flex-1">
              <h4 className="text-gray-900 dark:text-white font-semibold text-sm">Clothes</h4>
              <p className="text-gray-500 dark:text-gray-400 text-xs">28 items</p>
            </div>
             <span className="material-symbols-outlined text-gray-400 text-[20px]">chevron_right</span>
          </div>
          <div className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 mr-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
               <span className="material-symbols-outlined text-[20px]">styler</span>
            </div>
            <div className="flex-1">
              <h4 className="text-gray-900 dark:text-white font-semibold text-sm">Accessories</h4>
              <p className="text-gray-500 dark:text-gray-400 text-xs">14 items</p>
            </div>
             <span className="material-symbols-outlined text-gray-400 text-[20px]">chevron_right</span>
          </div>
        </div>
      </div>
    </div>
  );
};

window.Profile = Profile;
