const Onboarding = () => {
  return (
    <div className="relative flex h-full min-h-screen w-full max-w-md mx-auto flex-col justify-between bg-background-light dark:bg-background-dark shadow-xl overflow-hidden">
      {/* Header */}
      <header className="flex w-full items-center justify-center pt-8 pb-4 px-6 z-10">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <span className="material-symbols-outlined text-xl">checkroom</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-[#0d121b] dark:text-white">StyleAI</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start w-full">
        <div className="w-full px-4 py-4">
          <div className="grid grid-cols-2 gap-3 h-[420px]">
            {/* Large Left Image */}
            <div className="relative h-full w-full overflow-hidden rounded-2xl group">
              <div className="absolute inset-0 bg-black/5 z-10 dark:bg-black/20"></div>
              <div
                className="h-full w-full bg-center bg-cover transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCWqc117KQrGUcQabik4X35I5V_UM0DjlLYGREXIbkrHTcpcFeG2J7SKaL97L37Kl2sRKPXi9joC7-dw97z-TEC-zFYH2GgefDgR-yzgzh5398Twp-l7HdVCsSUrb7f5-g8dk8hKAS2vroPT3hjFC40n2-hG9dKuWPooGDn3x_qNCv1Zn2mHuAUOdWtN0T0Rgag-13C8BGMv3T6o_IC8KLF9233R9XGZwbl8jWm4hQAn1SpyRR_6JpY5OarkooNmRVnIxQNVHFoUX8')",
                }}
              ></div>
              <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 backdrop-blur-sm dark:bg-gray-900/90 shadow-sm">
                <span className="material-symbols-outlined text-[16px] text-primary">auto_awesome</span>
                <span className="text-xs font-semibold text-gray-900 dark:text-white">AI Styled</span>
              </div>
            </div>

            {/* Right Column Images */}
            <div className="flex flex-col gap-3 h-full">
              <div className="relative flex-1 w-full overflow-hidden rounded-2xl">
                <div
                  className="h-full w-full bg-center bg-cover"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD25GRW6fFAlt22Y4v_BDsuWTH-ex_1cDZrQdc8kb3ivP9xVZgZjoOECaj2CwFT6-0KSZueZmUk2ChJ77IDVjs3yO2kkneiCAdqo-Nf9S2TD1RlMRD8UyZpCN_da3QZOYRopj9U_VmogLD7m4OP7vjCd6E2_z1vEeYxVr9_RX0IjAJ5OF4BeLvXQoPFD4WakM3gYhVuZqaBrW1W1aBE1Hf_gK54_TU6rkZgvuzEY9AiEcyydxJfiL1tWrH4bjebiuFwH5FnalLhHik')",
                  }}
                ></div>
              </div>
              <div className="relative flex-1 w-full overflow-hidden rounded-2xl">
                <div
                  className="h-full w-full bg-center bg-cover"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDnmTxOONPLWUmhjurmHXsKz_2qP6ICkica3aCkRp60I-oXtiX2mMreHjFkZIEw2Oxdn7qG4xU7oyLoGT8BxxSW7JUQDVvwWp7jmD9K-mwIv6UcSORgA6lxR1LsJNqFeR0jpRq1qM1UTvCTwzNlDk2rr_B11Bx49iO2BJLYV49lq4VLa13BmRFLUQmvb_ppzeFq_tBo2DwKGn9c9nwgdPH3AVs2xqhobGYyVzph4grZ-dqWbLaM6wjWjM9uWVnFPGhhwGAN-L6UOgU')",
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg dark:bg-gray-800/90">
                    <span className="material-symbols-outlined text-primary">add</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col items-center px-6 pt-2 pb-6 text-center">
          <h1 className="text-[#0d121b] dark:text-white tracking-tight text-[32px] font-bold leading-[1.15] mb-3">
            Your Personal <br />
            <span className="text-primary relative inline-block">
              AI Stylist
              <svg
                className="absolute -bottom-1 left-0 w-full h-2 text-primary/20"
                preserveAspectRatio="none"
                viewBox="0 0 100 10"
              >
                <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="3"></path>
              </svg>
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-base font-normal leading-relaxed max-w-[320px]">
            Upload your wardrobe and let our AI curate perfect outfits with matching accessories instantly.
          </p>

          {/* Page Indicators */}
          <div className="flex w-full flex-row items-center justify-center gap-2 pt-8 pb-4">
            <div className="h-2 w-8 rounded-full bg-primary transition-all duration-300"></div>
            <div className="h-2 w-2 rounded-full bg-[#cfd7e7] dark:bg-gray-700"></div>
            <div className="h-2 w-2 rounded-full bg-[#cfd7e7] dark:bg-gray-700"></div>
          </div>
        </div>
      </main>

      {/* Footer / Action Buttons */}
      <footer className="w-full px-6 pb-8 pt-2 bg-background-light dark:bg-background-dark">
        <div className="flex flex-col gap-3">
          <a
            href="closet.html"
            className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-[52px] bg-primary text-white text-[17px] font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="relative z-10">Create Account</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </a>
          <a href="closet.html" className="flex w-full cursor-pointer items-center justify-center rounded-xl h-[48px] bg-transparent text-gray-600 dark:text-gray-300 text-[16px] font-semibold leading-normal hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
            I already have an account
          </a>
        </div>

        {/* Trust Indicator */}
        <div className="mt-6 flex items-center justify-center gap-2 opacity-60">
          <div className="flex -space-x-2 overflow-hidden">
            <img
              alt="Avatar 1"
              className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#101622] object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvfHavVd6qeWXX61vfppjPf0bjCpsnglgc9ML9-jFw2r4W1QSjfH85YRF5j-8TQz5clNXNoiDJU1zJf99N02v2lbLgCL1kEKMFzJ4uTMuKdOhUcJ4vYOQ2aZPlwoi2uuDkiRlf3OWwk2Nj-ZRSCKaa3_dznRCz86mp6WFsn73zpoI505NT1Pp2dhYnIWEM4N6gb_E9wYKN-kya6MoAmDZMui0CcrSK3QSFaSm_kbqW6UF7tPChzfAD0e982uukPj9DOfvx81M1rU8"
            />
            <img
              alt="Avatar 2"
              className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#101622] object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRr1js9rO2ozWAzjLvPLZjGR6wNLyg5Pbpab-9N-TmrlwO7gEuBmPYvpgVZHnTKJWrvWhaeCC4mTFUv81vtdozErNDpVN9g0k4Vy0_19YxR0fQhYqSJ0t8BNb54hChknxrH-4fZHbKr7oEGcVwhGfXT6IJCIclRl7rPzQAFVnM_6Yubbg0Brf_OmdgqIT_26SJZXi8bGze2OPQRoeF-jSr2FTMf8YiG9JJHz5rDcxllrCXLnd-UO6Q-mwcnMAD6tsJdC2ANNsPnhA"
            />
            <img
              alt="Avatar 3"
              className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#101622] object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwAJIcPYz6GeLM0qGA0iszkIwILRyFu0GMcfcd-GEhQ7NjrTvcCEjL70eFZA9Fmb_mY4kPQFJfmkxJDaXWQA5zkm7HdKBEEnhRyxppwr7dzZEXsVtMYPnoGGgofTlkSCxVypRwc8m5f25vHSKOlHud9-sZr8Tn78h7h-U3qziNQ_xaXwubArt90MRjoG5s086cSOwkFO4-q0lHv1Od89zzAN_pslPVANHMm3rYiKFKHvZP8wxWJKI5arKOF4zpMWWYCZP4gyEuCYc"
            />
          </div>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Loved by 50k+ fashionistas</span>
        </div>
      </footer>
    </div>
  );
};

window.Onboarding = Onboarding;
