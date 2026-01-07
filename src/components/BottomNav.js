const BottomNav = ({ currentScreen }) => {
  const navItems = [
    { id: 'generator', label: 'Generator', icon: 'auto_awesome', href: 'generator.html' },
    { id: 'outfits', label: 'Outfits', icon: 'style', href: 'outfits.html' },
    { id: 'closet', label: 'Closet', icon: 'checkroom', href: 'closet.html' },
    { id: 'profile', label: 'Profile', icon: 'person', href: 'profile.html' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-card-dark/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 pb-safe pt-2 max-w-md mx-auto">
      <div className="flex h-[60px] items-center justify-around px-2 pb-2">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <a
              key={item.id}
              href={item.href}
              className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors group ${
                isActive ? 'text-primary' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[24px] transition-transform duration-300 ${
                  isActive ? 'fill-1' : 'group-hover:-translate-y-0.5'
                }`}
              >
                {item.icon}
              </span>
              <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
};

window.BottomNav = BottomNav;
