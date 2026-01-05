import React from 'react';
import { Outfit } from '../types';

const OUTFITS: Outfit[] = [
  {
    id: '1',
    title: 'City Casual',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBioRJx1cAOkJJd9CzJ3mnzMPU80gX5Ixx9C7QhUYEZ2fvoDXwQG0TUnzJvPbBEdo0REZXo_eutdzlb129_4cMND-b7QmSLhOhlZ_xfA7D4aIckOFCIo5-ahZGyEC6Uo_PUmPRQ0si6wPvCaziUGaK2PLWNtc-4nE5cKXxyZRooe1FcFMNIK4Y2zXIzpDX6NZ8JqpwFLOKfETEtxq7toHznMRlIYDQ7D-mfct7m9VyjHdb3IoBHIeY2r9UCiYvJmfnRbgmRI-p7kHI',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDtvUcTjT5ej2O9CzI0n6qLf0LpN0eyY1cc44DN8Wtsq7mr5biTne_EqYOnjAmxFXT_aglbaz2E2wC-cuS5bVDP-wqwkdWoKiFNsrzMkChpPH1YzxRHI-2SqgcNiZTZHZFDtlszYNdMAQB_ShmnUAsc0g8FrxtJk5l0H6M2NB0imetlKA5O7nydtNtCp2c9G_pXX6ui_Jpyc5twGx_OvsmA9Tle4rVdTcClY7rSwO6jeVQUDIC_BTv-5VxX5SoWejZ2jFFJfWIgask',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCty6jQT7x_CA2RN4-wwxUDdYbLDcUgK6cHv4eu_wfxPi4vv5Me1tZaOmwOqIeUjyCAWgTWYVME96zpz5ob8iAIIsUDAJJAFsK5WjVCuDr8u6n16fMdrcXgqpZWtejO1ucfJ_wrnkxaJu7woFIg73EYdboTIMuaPe09TZBwXzCywQVJb1yHPwrvRnfrTEvgupJPKfPSyxdpKikjqb3cP3u0nOniDjHUtV2mnN0a88Vyg4ykj1RvOoiGNIujiAgJiX1jD24AOes-vrA',
    ],
    tag: 'Streetwear',
    itemCount: 3,
    tagColor: 'text-primary'
  },
  {
    id: '2',
    title: 'Summer Brunch',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBu1ghN5v6ZSylIlqdIqCQsemp3aU0ab96b8CFMt5oPvjmh1kd0E6uULccXcaJ0kTlPM1YA_Q6TbjEAss075-G3CAwt-t4YQT6bw1juHt4r20AvUF_P0RyIMV1QYv8vGHt9cfy_V_oyduBAGQOK0vQStFg720Vushh22RqZHFVaUUIvps_eIiYX-6GYLdAk5AgSC6sE-u_q1X_J_c1h6n_X0wQ9cbFFiqoiSKpnppCUtUNg5TddD0fzwiRg4dY90BD5e-Xpsgbbrqs',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDFdRZfiGRXX4Qt66Pq3vrmlduorHMnSR5XtmOpobzyljP9_niC-_-fjLG8T82tNayPLeDDkP5Ny0949OZ-b6ZjloweG0IwDGTcI_cVVfl0LEL-neR0MUft6ZFhdykkt-PizwFGsJMyJCwgpIlP89YtIDtO9jfc5uD49AtF9d5ngKkfIxkdNuimC85Yn4k5t36udFmruj-hUN041Hd1BA94dCwweQWAMlSzaiV6iXz9xV1-1TmVY2TO50-DBJmogiGCqJR9nSR27iY',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCP3SOyhdmtbRyRdAmUdz4IVqBpvFm9n95vW7igL4CLrTeT4OhFRupiOKhOIWpgqTz9t3LRM-FUY0gL4fJsmWIf6dEYDOefnbbDzADE2VS4gCaBdSoYbSuV24o2Wi8omGGg2jPiRIC9lPk0g18fJDrKCGaMKjO9a-BvA0Rq1kLnIDmx9JT3ZEhdNyp1MR0Tf_zzOv4MaqGPFwJeNnlIG8i2kMrh65dWkoO27rXlHowd6JaCNCbtgLsTqMVg6mP5-Ye7GUt0iMZzbLo'
    ],
    tag: 'Warm',
    itemCount: 3,
    tagColor: 'text-orange-500',
    isFavorite: true
  },
  {
    id: '3',
    title: 'Smart Chic',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCty6jQT7x_CA2RN4-wwxUDdYbLDcUgK6cHv4eu_wfxPi4vv5Me1tZaOmwOqIeUjyCAWgTWYVME96zpz5ob8iAIIsUDAJJAFsK5WjVCuDr8u6n16fMdrcXgqpZWtejO1ucfJ_wrnkxaJu7woFIg73EYdboTIMuaPe09TZBwXzCywQVJb1yHPwrvRnfrTEvgupJPKfPSyxdpKikjqb3cP3u0nOniDjHUtV2mnN0a88Vyg4ykj1RvOoiGNIujiAgJiX1jD24AOes-vrA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBu1ghN5v6ZSylIlqdIqCQsemp3aU0ab96b8CFMt5oPvjmh1kd0E6uULccXcaJ0kTlPM1YA_Q6TbjEAss075-G3CAwt-t4YQT6bw1juHt4r20AvUF_P0RyIMV1QYv8vGHt9cfy_V_oyduBAGQOK0vQStFg720Vushh22RqZHFVaUUIvps_eIiYX-6GYLdAk5AgSC6sE-u_q1X_J_c1h6n_X0wQ9cbFFiqoiSKpnppCUtUNg5TddD0fzwiRg4dY90BD5e-Xpsgbbrqs',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBioRJx1cAOkJJd9CzJ3mnzMPU80gX5Ixx9C7QhUYEZ2fvoDXwQG0TUnzJvPbBEdo0REZXo_eutdzlb129_4cMND-b7QmSLhOhlZ_xfA7D4aIckOFCIo5-ahZGyEC6Uo_PUmPRQ0si6wPvCaziUGaK2PLWNtc-4nE5cKXxyZRooe1FcFMNIK4Y2zXIzpDX6NZ8JqpwFLOKfETEtxq7toHznMRlIYDQ7D-mfct7m9VyjHdb3IoBHIeY2r9UCiYvJmfnRbgmRI-p7kHI'
    ],
    tag: 'Work',
    itemCount: 3,
    tagColor: 'text-purple-600 dark:text-purple-400',
    description: 'Last worn 3d'
  },
  {
    id: '4',
    title: 'Weekend Vibes',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDFdRZfiGRXX4Qt66Pq3vrmlduorHMnSR5XtmOpobzyljP9_niC-_-fjLG8T82tNayPLeDDkP5Ny0949OZ-b6ZjloweG0IwDGTcI_cVVfl0LEL-neR0MUft6ZFhdykkt-PizwFGsJMyJCwgpIlP89YtIDtO9jfc5uD49AtF9d5ngKkfIxkdNuimC85Yn4k5t36udFmruj-hUN041Hd1BA94dCwweQWAMlSzaiV6iXz9xV1-1TmVY2TO50-DBJmogiGCqJR9nSR27iY',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDtvUcTjT5ej2O9CzI0n6qLf0LpN0eyY1cc44DN8Wtsq7mr5biTne_EqYOnjAmxFXT_aglbaz2E2wC-cuS5bVDP-wqwkdWoKiFNsrzMkChpPH1YzxRHI-2SqgcNiZTZHZFDtlszYNdMAQB_ShmnUAsc0g8FrxtJk5l0H6M2NB0imetlKA5O7nydtNtCp2c9G_pXX6ui_Jpyc5twGx_OvsmA9Tle4rVdTcClY7rSwO6jeVQUDIC_BTv-5VxX5SoWejZ2jFFJfWIgask',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCty6jQT7x_CA2RN4-wwxUDdYbLDcUgK6cHv4eu_wfxPi4vv5Me1tZaOmwOqIeUjyCAWgTWYVME96zpz5ob8iAIIsUDAJJAFsK5WjVCuDr8u6n16fMdrcXgqpZWtejO1ucfJ_wrnkxaJu7woFIg73EYdboTIMuaPe09TZBwXzCywQVJb1yHPwrvRnfrTEvgupJPKfPSyxdpKikjqb3cP3u0nOniDjHUtV2mnN0a88Vyg4ykj1RvOoiGNIujiAgJiX1jD24AOes-vrA'
    ],
    tag: 'Relaxed',
    itemCount: 3,
    tagColor: 'text-teal-600 dark:text-teal-400',
    description: 'AI Pick'
  },
  {
    id: '5',
    title: 'Evening Date',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBu1ghN5v6ZSylIlqdIqCQsemp3aU0ab96b8CFMt5oPvjmh1kd0E6uULccXcaJ0kTlPM1YA_Q6TbjEAss075-G3CAwt-t4YQT6bw1juHt4r20AvUF_P0RyIMV1QYv8vGHt9cfy_V_oyduBAGQOK0vQStFg720Vushh22RqZHFVaUUIvps_eIiYX-6GYLdAk5AgSC6sE-u_q1X_J_c1h6n_X0wQ9cbFFiqoiSKpnppCUtUNg5TddD0fzwiRg4dY90BD5e-Xpsgbbrqs',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCP3SOyhdmtbRyRdAmUdz4IVqBpvFm9n95vW7igL4CLrTeT4OhFRupiOKhOIWpgqTz9t3LRM-FUY0gL4fJsmWIf6dEYDOefnbbDzADE2VS4gCaBdSoYbSuV24o2Wi8omGGg2jPiRIC9lPk0g18fJDrKCGaMKjO9a-BvA0Rq1kLnIDmx9JT3ZEhdNyp1MR0Tf_zzOv4MaqGPFwJeNnlIG8i2kMrh65dWkoO27rXlHowd6JaCNCbtgLsTqMVg6mP5-Ye7GUt0iMZzbLo',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBioRJx1cAOkJJd9CzJ3mnzMPU80gX5Ixx9C7QhUYEZ2fvoDXwQG0TUnzJvPbBEdo0REZXo_eutdzlb129_4cMND-b7QmSLhOhlZ_xfA7D4aIckOFCIo5-ahZGyEC6Uo_PUmPRQ0si6wPvCaziUGaK2PLWNtc-4nE5cKXxyZRooe1FcFMNIK4Y2zXIzpDX6NZ8JqpwFLOKfETEtxq7toHznMRlIYDQ7D-mfct7m9VyjHdb3IoBHIeY2r9UCiYvJmfnRbgmRI-p7kHI'
    ],
    tag: 'Romantic',
    itemCount: 3,
    tagColor: 'text-rose-500',
    description: 'Fav'
  },
  {
    id: '6',
    title: 'Coffee Run',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDtvUcTjT5ej2O9CzI0n6qLf0LpN0eyY1cc44DN8Wtsq7mr5biTne_EqYOnjAmxFXT_aglbaz2E2wC-cuS5bVDP-wqwkdWoKiFNsrzMkChpPH1YzxRHI-2SqgcNiZTZHZFDtlszYNdMAQB_ShmnUAsc0g8FrxtJk5l0H6M2NB0imetlKA5O7nydtNtCp2c9G_pXX6ui_Jpyc5twGx_OvsmA9Tle4rVdTcClY7rSwO6jeVQUDIC_BTv-5VxX5SoWejZ2jFFJfWIgask',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCty6jQT7x_CA2RN4-wwxUDdYbLDcUgK6cHv4eu_wfxPi4vv5Me1tZaOmwOqIeUjyCAWgTWYVME96zpz5ob8iAIIsUDAJJAFsK5WjVCuDr8u6n16fMdrcXgqpZWtejO1ucfJ_wrnkxaJu7woFIg73EYdboTIMuaPe09TZBwXzCywQVJb1yHPwrvRnfrTEvgupJPKfPSyxdpKikjqb3cP3u0nOniDjHUtV2mnN0a88Vyg4ykj1RvOoiGNIujiAgJiX1jD24AOes-vrA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBioRJx1cAOkJJd9CzJ3mnzMPU80gX5Ixx9C7QhUYEZ2fvoDXwQG0TUnzJvPbBEdo0REZXo_eutdzlb129_4cMND-b7QmSLhOhlZ_xfA7D4aIckOFCIo5-ahZGyEC6Uo_PUmPRQ0si6wPvCaziUGaK2PLWNtc-4nE5cKXxyZRooe1FcFMNIK4Y2zXIzpDX6NZ8JqpwFLOKfETEtxq7toHznMRlIYDQ7D-mfct7m9VyjHdb3IoBHIeY2r9UCiYvJmfnRbgmRI-p7kHI'
    ],
    tag: 'Comfy',
    itemCount: 3,
    tagColor: 'text-slate-500 dark:text-slate-400',
    description: 'New'
  }
];

const Closet: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col pb-28 bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-[#0d121b] dark:text-white">Closet</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">24 Saved coordinations</p>
        </div>
        <button className="flex items-center justify-center w-10 h-10 bg-white dark:bg-[#1e2736] text-[#0d121b] dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm active:scale-95 transition-all hover:border-primary hover:text-primary">
          <span className="material-symbols-outlined">add</span>
        </button>
      </header>

      {/* Search & Filters */}
      <div className="sticky top-[73px] z-30 bg-background-light dark:bg-background-dark pt-3 pb-2 shadow-sm dark:shadow-none">
        <div className="px-4 mb-3">
          <div className="group flex items-center w-full h-12 rounded-xl bg-white dark:bg-[#1e2736] border border-gray-200 dark:border-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all overflow-hidden">
            <div className="pl-4 pr-3 text-gray-400 group-focus-within:text-primary transition-colors">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              className="w-full bg-transparent border-none focus:ring-0 text-base font-normal placeholder-gray-400 text-[#0d121b] dark:text-white h-full p-0"
              type="text"
              placeholder="Search outfits, styles, events..."
            />
            <button className="px-4 h-full border-l border-gray-100 dark:border-gray-700 text-gray-400 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <span className="material-symbols-outlined">tune</span>
            </button>
          </div>
        </div>
        <div className="px-4 flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {['All Outfits', 'Favorites', 'Summer', 'Work', 'Date Night'].map((filter, index) => (
            <button
              key={filter}
              className={`flex shrink-0 items-center h-9 px-4 rounded-lg text-sm font-medium whitespace-nowrap transition-all active:scale-95 ${
                index === 0
                  ? 'bg-primary text-white font-bold shadow-lg shadow-primary/20'
                  : 'bg-white dark:bg-[#1e2736] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <main className="p-4 grid grid-cols-2 gap-4 auto-rows-min">
        {OUTFITS.map((outfit) => (
          <div
            key={outfit.id}
            className="group relative flex flex-col bg-white dark:bg-[#1e2736] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ring-1 ring-gray-200 dark:ring-gray-800"
          >
            <div className={`absolute top-2 right-2 z-10 ${outfit.isFavorite ? '' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
              <button className={`w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center shadow-sm transition-colors ${outfit.isFavorite ? 'bg-white/90 dark:bg-black/60 text-red-500 hover:bg-white' : 'bg-white/90 dark:bg-black/60 text-gray-500 hover:text-red-500 hover:bg-white'}`}>
                <span className={`material-symbols-outlined text-[18px] ${outfit.isFavorite ? 'fill-1' : ''}`}>favorite</span>
              </button>
            </div>

            <div className="aspect-[4/5] w-full bg-[#f8f9fc] dark:bg-gray-800 relative grid grid-cols-2 grid-rows-2 gap-0.5 border-b border-gray-100 dark:border-gray-700">
                {/* Collage Logic based on provided HTML style */}
                {outfit.id === '1' && (
                  <>
                     <div className="row-span-2 bg-center bg-cover" style={{ backgroundImage: `url('${outfit.images[0]}')` }}></div>
                     <div className="bg-center bg-cover" style={{ backgroundImage: `url('${outfit.images[1]}')` }}></div>
                     <div className="bg-center bg-cover" style={{ backgroundImage: `url('${outfit.images[2]}')` }}></div>
                  </>
                )}
                {outfit.id === '2' && (
                  <>
                     <div className="col-span-2 bg-center bg-cover" style={{ backgroundImage: `url('${outfit.images[0]}')`, backgroundPosition: 'top center' }}></div>
                     <div className="bg-center bg-cover" style={{ backgroundImage: `url('${outfit.images[1]}')` }}></div>
                     <div className="bg-center bg-cover" style={{ backgroundImage: `url('${outfit.images[2]}')` }}></div>
                  </>
                )}
                {outfit.id !== '1' && outfit.id !== '2' && (
                     <>
                     {/* Default layout pattern mimicking others mostly */}
                     <div className="row-span-2 bg-center bg-cover" style={{ backgroundImage: `url('${outfit.images[0]}')` }}></div>
                     <div className="bg-center bg-cover" style={{ backgroundImage: `url('${outfit.images[1]}')` }}></div>
                     <div className="bg-center bg-cover" style={{ backgroundImage: `url('${outfit.images[2]}')` }}></div>
                  </>
                )}
            </div>

            <div className="p-3 flex flex-col gap-1">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-bold text-[#0d121b] dark:text-white line-clamp-1">{outfit.title}</h3>
                <button className="text-gray-400 hover:text-[#0d121b] dark:hover:text-white -mr-1">
                  <span className="material-symbols-outlined text-[20px]">more_vert</span>
                </button>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] uppercase font-bold tracking-wide ${outfit.tagColor}`}>
                  {outfit.tag}
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {outfit.description || `${outfit.itemCount} items`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Closet;
