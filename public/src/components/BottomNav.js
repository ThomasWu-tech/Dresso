const BottomNav = ({ currentScreen }) => {
  const navItems = [
    { id: 'generator', label: 'Generator', icon: 'auto_awesome', href: 'generator.html' },
    { id: 'closet', label: 'Closet', icon: 'checkroom', href: 'closet.html' },
    { id: 'profile', label: 'Profile', icon: 'person', href: 'profile.html' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border-t border-black/[0.05] dark:border-white/[0.05] pb-[env(safe-area-inset-bottom)] pt-1.5 max-w-md mx-auto">
      <div className="flex h-[50px] items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <a
              key={item.id}
              href={item.href}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 transition-all duration-200 ${
                isActive ? 'text-[#007AFF] scale-105' : 'text-[#8E8E93] dark:text-[#98989D]'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[26px] leading-none transition-all duration-200 ${
                  isActive ? 'fill-1 font-variation-settings-["FILL"_1]' : 'font-variation-settings-["FILL"_0]'
                }`}
              >
                {item.icon}
              </span>
              <span className={`text-[10px] tracking-tight ${isActive ? 'font-semibold' : 'font-medium'}`}>
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
