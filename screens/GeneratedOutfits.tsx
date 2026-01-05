import React from 'react';
import { Outfit } from '../types';

const GENERATED_OUTFITS: Outfit[] = [
  {
    id: 'gen-1',
    title: 'Weekend Denim',
    description: 'Perfect for casual city walks.',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuA6ylW20ni2UwMxf8aByL3u7iY4Rxrf_fPcH_wmrjo3cdWXX1ldUtDjEa3mSmuAjiTsYwYxTAFh0j21CsJlPkJBeG9855lwZQZLoaFdrTWwtDUlCYcnZCqOD9iEQ13Umtd26NsPeAgiumju0ehE0v5BaUXCQZ0LVpvm46JhCuFCf0V5ltapBSm_g6aKGJiqOYaRm9FHT9xa2mZbV9sWUiajJjHeinhqFn424fKX1Vg8im4LozQLBz6DIHW3PKDAIJ4fKJeok6SUHFU'],
    tag: 'Casual',
    itemCount: 4,
    matchPercentage: 98,
    accessories: [
      { id: 'a1', name: 'Silver Watch', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFq281YH33GB8ZzLHOBpJo3RuboIjmhnBM_GNPw4tov3Hai7_2tS80WilNoRdj1o4acxkiIEB5S6cFkaYpaNyYpGMw2aFHYIp6YGLp7qLR3tmos5P8hNvpWXDjjyQsFenvqOdc85dZi2_LBfCb8ZtOxGsreTZUhAnvFWDGl7WcrWhbnTxOWjbvU0_K488gwUjzC_Dj-ZQM6nLoFVhj_3UY4gLdeQBzuklITLSdHisWgOKHJ46yQsgsPths6FrL9-wgwmi5agFp-CA', type: 'clothing' },
      { id: 'a2', name: 'Canvas Kicks', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDa0RLXqusDTYMtQjj-alc-RUMp2VVyW4Xm2x_r7ksP1c-8uamnFV3OqFEAXoouBhlAp2aSqp0PnbKiX2h6QizmyzoHWyNb6-L5ZOwdVXMJBEdWybGLCBSdHShD4S-ZDMwFmrutt0mQkHzb6opuK7zSiRsuewtqfxqOLNP7aOrZ0Ct5XNOVTKjhvnscfbbQWVKMmrR2J6csEFigmv0ZtkZ5f8fjSxXcgee2YN5UarUjNdkbifCBe4T2d_FVbHZFYTddaD1vsvtCgcE', type: 'shopping' },
      { id: 'a3', name: 'Backpack', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVOpWMR4xoYgLIcGYkxz5T4Grtsp4AcmJvv24ZMi9yWVVwA2iPmTmYWtVXchPemJUdJnxBrDovfqWYoysuIbKXYRFTW9uDU9Y5Ubfr1xc8IE_BkhyCjDDP5pag-5dnbqwmpCt-6jqA51Uw-J4a0BE7PEes5FfC__hfUNy-yyMBcMa4yIX1C1_KUo3o62STFxoZiiaJdJ5sHUbv8JCoSytLMcY7wiDht7K7aPm_iuKTalkfyAzoXlzFZIWrlquc3P6XBKKvW1bRMOE', type: 'clothing' },
    ]
  },
  {
    id: 'gen-2',
    title: 'Autumn Chic',
    description: 'Cozy layers for colder days.',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuB9LTbmsnEuAP1E-VcZn_DBUwhsVUsh5KB-6X7k9BqS4xLnl4bqjDT7r9GsbGW3HTF3ti08mXMvn_10-l6kLGN7vt1o81QcJAS0wEECcwVjVlpaklHDHWY4Mv5wZv6-S2nS3D0EX5qqSRFRsn6dKXGbLqKngJ8iLYKgPv-ccVxzhUwJ5lMr6W0hqLXVvxYGZGo4Khqw1e-jH3WMKRd8is_ug2ViaGLdG2frJOuAQpGANom7uYcc0Xwmavl6dSDUIkZxIo3svIM_m18'],
    tag: 'Work',
    itemCount: 3,
    matchPercentage: 92,
    accessories: [
       { id: 'a4', name: 'Wool Scarf', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvweiXe0wvTLXJ_RgDYXvJ53pq5ig4DQh7RgTJxX2RBvKSg9y92hKM6S68WnP6gxph8oioisoGNHtvDj_ZCqZEwVzVKnJhnYZGzSb-fx0bZBy0AiZSUxAGIWJCxwzXDjSQZUQ-IxEhd5Eqqiw5ktRp1Sg25Lyv6k1iEUZ1I6a4-ij0iGb3-5baGGDoXv6y4W2rnGKgkRsvtUcIF0Lq9xLq_JTvK2gHH5dFcfA_oHb3I1OKkanESOEf18MWjsSahOI6017Q5HAjGhU', type: 'clothing' },
       { id: 'a5', name: 'Platform Sneakers', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJtiLIYYkUH8N6xQkwj5XscUnwO-SJejyBUZTckjV86JhVST5y5xgA9X9EbSMUHl3twoF_wfUW8N9Y0JXoqDBqEYu7Aq4hVgN90VLCt7o9IAlYaZWpIy1Mivn58Pf1VXWtdpEE66Dc6NUMfMjwP9rOAc3hGFUXkqfHqTwOgeBwRKJWr1sZ8ALz0RsDsWeLvKuJjURq6vyDWDzB1G8xKKi_7G11jYsE9pY7MhR8RiKCFTjTNCXgo4PEbTV-FJHVX3UHInP9s20ZcAU', type: 'shopping' }
    ]
  }
];

const GeneratedOutfits: React.FC = () => {
  return (
    <div className="relative flex flex-col w-full max-w-md mx-auto min-h-screen bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
        <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-white">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold leading-tight tracking-tight text-center flex-1">Generated Outfits</h1>
        <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-white">
          <span className="material-symbols-outlined">tune</span>
        </button>
      </header>

      {/* Filters */}
      <div className="w-full overflow-x-auto no-scrollbar pb-2">
        <div className="flex gap-3 px-4 min-w-max">
          <button className="flex items-center justify-center px-4 h-9 rounded-full bg-primary text-white font-medium text-sm transition-transform active:scale-95 shadow-lg shadow-primary/30">Casual</button>
          <button className="flex items-center justify-center px-4 h-9 rounded-full bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium text-sm transition-transform active:scale-95 whitespace-nowrap">Work</button>
          <button className="flex items-center justify-center px-4 h-9 rounded-full bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium text-sm transition-transform active:scale-95 whitespace-nowrap">Date Night</button>
          <button className="flex items-center justify-center px-4 h-9 rounded-full bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium text-sm transition-transform active:scale-95 whitespace-nowrap">Vacation</button>
        </div>
      </div>

      {/* Main Feed */}
      <main className="flex-1 p-4 space-y-6">
        {GENERATED_OUTFITS.map((outfit) => (
          <article key={outfit.id} className="bg-card-light dark:bg-card-dark rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800/50">
            {/* Main Image */}
            <div className="relative w-full aspect-[4/5] bg-slate-100 dark:bg-slate-800 group">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${outfit.images[0]}')` }}></div>
              <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                <span className="material-symbols-outlined text-green-500 text-[18px]">auto_awesome</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">{outfit.matchPercentage}% Match</span>
              </div>
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm shadow-sm text-slate-400 hover:text-red-500 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">favorite</span>
                </button>
                <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm shadow-sm text-slate-700 dark:text-white hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">ios_share</span>
                </button>
              </div>
            </div>

            {/* Details */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{outfit.title}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{outfit.description}</p>
                </div>
              </div>

              <div className="h-px w-full bg-slate-100 dark:bg-slate-800 my-4"></div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Recommended Accessories</h3>
                <div className="grid grid-cols-3 gap-3">
                  {outfit.accessories?.map((acc) => (
                    <div key={acc.id} className="flex flex-col gap-2 group cursor-pointer">
                      <div className="relative aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-100 dark:border-slate-700">
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${acc.image}')` }}></div>
                        <div className={`absolute bottom-1 right-1 p-1 rounded-md shadow-sm ${acc.type === 'shopping' ? 'bg-primary' : 'bg-white dark:bg-slate-900'}`}>
                          <span className={`material-symbols-outlined text-[12px] ${acc.type === 'shopping' ? 'text-white' : 'text-primary'}`}>
                            {acc.type === 'shopping' ? 'shopping_bag' : 'checkroom'}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{acc.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </main>

      {/* FAB */}
      <div className="fixed bottom-20 right-6 z-30">
        <button className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/40 hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-300 group">
          <span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform">add</span>
        </button>
      </div>
    </div>
  );
};

export default GeneratedOutfits;
