const Onboarding = () => {
  return (
    <div className="relative flex h-full min-h-screen w-full max-w-md mx-auto flex-col justify-between bg-[#F2F2F7] dark:bg-black overflow-hidden">
      {/* Header */}
      <header className="flex w-full items-center justify-center pt-12 pb-4 px-6 z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#007AFF] text-white shadow-sm">
            <span className="material-symbols-outlined text-2xl">checkroom</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-black dark:text-white">Dresso</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start w-full px-6">
        <div className="w-full py-4">
          <div className="grid grid-cols-2 gap-4 h-[420px]">
            {/* Large Left Image */}
            <div className="relative h-full w-full overflow-hidden rounded-[28px] group shadow-sm">
              <div className="absolute inset-0 bg-black/5 z-10 dark:bg-black/20"></div>
              <div
                className="h-full w-full bg-center bg-cover transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCWqc117KQrGUcQabik4X35I5V_UM0DjlLYGREXIbkrHTcpcFeG2J7SKaL97L37Kl2sRKPXi9joC7-dw97z-TEC-zFYH2GgefDgR-yzgzh5398Twp-l7HdVCsSUrb7f5-g8dk8hKAS2vroPT3hjFC40n2-hG9dKuWPooGDn3x_qNCv1Zn2mHuAUOdWtN0T0Rgag-13C8BGMv3T6o_IC8KLF9233R9XGZwbl8jWm4hQAn1SpyRR_6JpY5OarkooNmRVnIxQNVHFoUX8')",
                }}
              ></div>
              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 backdrop-blur-md dark:bg-black/60 shadow-sm border border-white/20">
                <span className="material-symbols-outlined text-[16px] text-[#007AFF]">auto_awesome</span>
                <span className="text-xs font-semibold text-black dark:text-white">AI Styled</span>
              </div>
            </div>

            {/* Right Column Images */}
            <div className="flex flex-col gap-4 h-full">
              <div className="relative flex-1 w-full overflow-hidden rounded-[28px] shadow-sm">
                <div
                  className="h-full w-full bg-center bg-cover"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD25GRW6fFAlt22Y4v_BDsuWTH-ex_1cDZrQdc8kb3ivP9xVZgZjoOECaj2CwFT6-0KSZueZmUk2ChJ77IDVjs3yO2kkneiCAdqo-Nf9S2TD1RlMRD8UyZpCN_da3QZOYRopj9U_VmogLD7m4OP7vjCd6E2_z1vEeYxVr9_RX0IjAJ5OF4BeLvXQoPFD4WakM3gYhVuZqaBrW1W1aBE1Hf_gK54_TU6rkZgvuzEY9AiEcyydxJfiL1tWrH4bjebiuFwH5FnalLhHik')",
                  }}
                ></div>
              </div>
              <div className="relative flex-1 w-full overflow-hidden rounded-[28px] shadow-sm">
                <div
                  className="h-full w-full bg-center bg-cover"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDnmTxOONPLWUmhjurmHXsKz_2qP6ICkica3aCkRp60I-oXtiX2mMreHjFkZIEw2Oxdn7qG4xU7oyLoGT8BxxSW7JUQDVvwWp7jmD9K-mwIv6UcSORgA6lxR1LsJNqFeR0jpRq1qM1UTvCTwzNlDk2rr_B11Bx49iO2BJLYV49lq4VLa13BmRFLUQmvb_ppzeFq_tBo2DwKGn9c9nwgdPH3AVs2xqhobGYyVzph4grZ-dqWbLaM6wjWjM9uWVnFPGhhwGAN-L6UOgU')",
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg dark:bg-black/60 border border-white/20">
                    <span className="material-symbols-outlined text-[#007AFF] text-3xl">add</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col items-center pt-4 pb-8 text-center space-y-4">
          <h1 className="text-black dark:text-white tracking-tight text-4xl font-bold leading-tight">
            Your Personal <br />
            <span className="text-[#007AFF]">AI Stylist</span>
          </h1>
          <p className="text-[#8E8E93] text-lg font-medium leading-relaxed max-w-[300px]">
            Upload your wardrobe and let AI curate perfect outfits instantly.
          </p>

          {/* Page Indicators */}
          <div className="flex w-full flex-row items-center justify-center gap-2 pt-6">
            <div className="h-2 w-7 rounded-full bg-[#007AFF]"></div>
            <div className="h-2 w-2 rounded-full bg-[#C7C7CC] dark:bg-[#3A3A3C]"></div>
            <div className="h-2 w-2 rounded-full bg-[#C7C7CC] dark:bg-[#3A3A3C]"></div>
          </div>
        </div>
      </main>

      {/* Footer / Action Buttons */}
      <footer className="w-full px-6 pb-12 pt-4 bg-transparent">
        <div className="flex flex-col gap-4">
          <a
            href="signup.html"
            className="flex w-full items-center justify-center rounded-2xl h-14 bg-[#007AFF] text-white text-lg font-semibold shadow-lg shadow-[#007AFF]/20 transition-all active:scale-[0.98]"
          >
            Get Started
          </a>
          <a 
            href="login.html" 
            className="flex w-full items-center justify-center h-14 bg-white dark:bg-[#1C1C1E] text-[#007AFF] text-lg font-semibold rounded-2xl transition-all active:scale-[0.98]"
          >
            Sign In
          </a>
        </div>

        {/* Trust Indicator */}
        <div className="mt-8 flex items-center justify-center gap-3 opacity-80">
          <div className="flex -space-x-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-7 w-7 rounded-full border-2 border-[#F2F2F7] dark:border-black bg-gray-200 overflow-hidden">
                <img
                  alt={`User ${i}`}
                  className="h-full w-full object-cover"
                  src={`https://i.pravatar.cc/100?img=${i + 10}`}
                />
              </div>
            ))}
          </div>
          <span className="text-sm font-medium text-[#8E8E93]">Join 50k+ stylists</span>
        </div>
      </footer>
    </div>
  );
};

window.Onboarding = Onboarding;
