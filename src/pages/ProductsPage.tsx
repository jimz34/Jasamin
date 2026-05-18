import { useState, useEffect, useMemo } from 'react';
import { Search, ShoppingCart, Star, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getWhatsAppLink, CATEGORIES } from '../lib/constants';
import LoadingSpinner from '../components/LoadingSpinner';

interface Product {
  id: string;
  nama: string;
  harga: number;
  deskripsi: string;
  kategori: string;
  gambar: string;
  badge_best_seller: boolean;
  created_at: string;
}

function formatRupiah(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error && data) setProducts(data);
    setLoading(false);
  }

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.nama.toLowerCase().includes(search.toLowerCase()) ||
        p.deskripsi.toLowerCase().includes(search.toLowerCase());
      const matchCategory = !category || p.kategori === category;
      return matchSearch && matchCategory;
    });
  }, [products, search, category]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-3 py-4 md:px-4 md:py-8">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-3xl font-bold text-gray-900">Produk Kami</h1>
          <p className="mt-0.5 md:mt-1 text-xs md:text-sm text-gray-500">Temukan jasa dan produk digital yang Anda butuhkan</p>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-2 mb-4 md:gap-3 md:mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari produk..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 md:pl-9 md:pr-4 md:py-2.5 text-xs md:text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`flex items-center gap-1 px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm font-medium rounded-xl border transition-colors ${
              category ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>

        {showFilter && (
          <div className="flex flex-wrap gap-1.5 mb-4 md:gap-2 md:mb-6 animate-[fadeIn_0.2s_ease-out]">
            <button
              onClick={() => { setCategory(''); setShowFilter(false); }}
              className={`px-2.5 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-medium rounded-lg transition-colors ${
                !category ? 'bg-emerald-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Semua
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setShowFilter(false); }}
                className={`px-2.5 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-medium rounded-lg transition-colors ${
                  category === cat ? 'bg-emerald-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 md:w-7 md:h-7 text-gray-400" />
            </div>
            <p className="text-gray-500 text-xs md:text-sm">Belum ada produk{search ? ' yang sesuai' : ''}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-5">
            {filtered.map(product => (
              <div key={product.id} className="group bg-white rounded-xl md:rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden">
                <div className="relative h-32 sm:h-40 md:aspect-[4/3] md:h-auto bg-gray-100 overflow-hidden">
                  {product.gambar ? (
                    <img src={product.gambar} alt={product.nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ShoppingCart className="w-6 h-6 md:w-10 md:h-10" />
                    </div>
                  )}
                  {product.badge_best_seller && (
                    <div className="absolute top-1.5 left-1.5 md:top-3 md:left-3 flex items-center gap-0.5 md:gap-1 px-1.5 py-0.5 md:px-2.5 md:py-1 bg-amber-400 text-white text-[8px] md:text-[10px] font-bold uppercase rounded-md md:rounded-lg shadow-sm">
                      <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-white" />
                      Best
                    </div>
                  )}
                </div>
                <div className="p-2.5 md:p-4">
                  <div className="text-[9px] md:text-[10px] font-medium text-emerald-600 bg-emerald-50 inline-block px-1.5 py-px md:px-2 md:py-0.5 rounded-md mb-1 md:mb-2">
                    {product.kategori}
                  </div>
                  <h3 className="text-[11px] md:text-sm font-semibold text-gray-900 mb-0.5 md:mb-1 line-clamp-1 leading-tight">{product.nama}</h3>
                  <p className="text-[10px] md:text-xs text-gray-500 mb-2 md:mb-3 line-clamp-1 md:line-clamp-2 leading-relaxed">{product.deskripsi}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-base font-bold text-emerald-600">{formatRupiah(product.harga)}</span>
                    <a
                      href={getWhatsAppLink(product.nama)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-0.5 px-2.5 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-medium text-white bg-emerald-500 rounded-full md:rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                      Beli
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
