import { useState, useEffect, useMemo, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { CATEGORIES } from '../lib/constants';
import { useToast } from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import { LayoutDashboard, Package, Plus, LogOut, Search, CreditCard as Edit3, Trash2, X, Upload, Star, Menu } from 'lucide-react';

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

type AdminView = 'dashboard' | 'products' | 'add' | 'edit';

const sidebarItems: { key: AdminView; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'products', label: 'Produk', icon: Package },
  { key: 'add', label: 'Tambah Produk', icon: Plus },
];

function formatRupiah(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

export default function AdminDashboardPage() {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { showToast, toastElement } = useToast();

  const [view, setView] = useState<AdminView>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  // Form state
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ nama: '', harga: '', deskripsi: '', kategori: 'Lainnya', gambar: '', badge_best_seller: false });
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate('/admin');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  }

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.nama.toLowerCase().includes(search.toLowerCase());
      const matchCategory = !filterCategory || p.kategori === filterCategory;
      return matchSearch && matchCategory;
    });
  }, [products, search, filterCategory]);

  function resetForm() {
    setForm({ nama: '', harga: '', deskripsi: '', kategori: 'Lainnya', gambar: '', badge_best_seller: false });
    setImagePreview('');
    setEditId(null);
  }

  function startEdit(p: Product) {
    setEditId(p.id);
    setForm({ nama: p.nama, harga: String(p.harga), deskripsi: p.deskripsi, kategori: p.kategori, gambar: p.gambar, badge_best_seller: p.badge_best_seller });
    setImagePreview(p.gambar);
    setView('edit');
  }

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setImagePreview(preview);

    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage.from('product-images').upload(fileName, file, { cacheControl: '3600', upsert: false });
    if (error) {
      showToast('Gagal upload gambar', 'error');
      return;
    }

    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
    setForm(f => ({ ...f, gambar: urlData.publicUrl }));
    showToast('Gambar berhasil diupload');
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nama || !form.harga) {
      showToast('Nama dan harga wajib diisi', 'error');
      return;
    }

    setSaving(true);
    const payload = {
      nama: form.nama,
      harga: Number(form.harga),
      deskripsi: form.deskripsi,
      kategori: form.kategori,
      gambar: form.gambar,
      badge_best_seller: form.badge_best_seller,
    };

    if (editId) {
      const { error } = await supabase.from('products').update(payload).eq('id', editId);
      if (error) { showToast('Gagal update produk', 'error'); setSaving(false); return; }
      showToast('Produk berhasil diupdate');
    } else {
      const { error } = await supabase.from('products').insert(payload);
      if (error) { showToast('Gagal tambah produk', 'error'); setSaving(false); return; }
      showToast('Produk berhasil ditambahkan');
    }

    resetForm();
    setView('products');
    fetchProducts();
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const { error } = await supabase.from('products').delete().eq('id', deleteTarget.id);
    if (error) { showToast('Gagal hapus produk', 'error'); } else { showToast('Produk berhasil dihapus'); }
    setDeleteTarget(null);
    fetchProducts();
  }

  async function handleSignOut() {
    await signOut();
    navigate('/admin');
  }

  if (authLoading) return <LoadingSpinner size="lg" />;
  if (!user) return null;

  const Sidebar = () => (
    <div className="bg-emerald-600 text-white h-full flex flex-col">
      <div className="px-5 py-5 border-b border-emerald-500">
        <h2 className="text-lg font-bold">JASA<span className="text-emerald-200">MIN</span></h2>
        <p className="text-xs text-emerald-200 mt-0.5">Admin Panel</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {sidebarItems.map(item => (
          <button
            key={item.key}
            onClick={() => { setView(item.key); setSidebarOpen(false); if (item.key === 'add') resetForm(); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${
              view === item.key ? 'bg-white/15 text-white' : 'text-emerald-100 hover:bg-white/10'
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="px-3 pb-4">
        <button onClick={handleSignOut} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-emerald-100 hover:bg-white/10 rounded-xl transition-colors">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  const ProductForm = () => (
    <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-5">{editId ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Nama Produk *</label>
          <input type="text" value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} required
            className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Harga (Rp) *</label>
          <input type="number" value={form.harga} onChange={e => setForm(f => ({ ...f, harga: e.target.value }))} required min="0"
            className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Kategori</label>
          <select value={form.kategori} onChange={e => setForm(f => ({ ...f, kategori: e.target.value }))}
            className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Deskripsi</label>
          <textarea value={form.deskripsi} onChange={e => setForm(f => ({ ...f, deskripsi: e.target.value }))} rows={3}
            className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 resize-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Gambar</label>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-lg cursor-pointer hover:bg-emerald-100 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              Upload
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            <span className="text-xs text-gray-400">atau masukkan URL</span>
          </div>
          <input type="text" value={form.gambar} onChange={e => { setForm(f => ({ ...f, gambar: e.target.value })); setImagePreview(e.target.value); }}
            placeholder="https://example.com/image.jpg"
            className="w-full mt-2 px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
          {imagePreview && (
            <div className="mt-3 relative inline-block">
              <img src={imagePreview} alt="Preview" className="w-32 h-24 object-cover rounded-xl border border-gray-200" />
              <button type="button" onClick={() => { setForm(f => ({ ...f, gambar: '' })); setImagePreview(''); }}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="bestseller" checked={form.badge_best_seller} onChange={e => setForm(f => ({ ...f, badge_best_seller: e.target.checked }))}
            className="w-4 h-4 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500/20" />
          <label htmlFor="bestseller" className="text-sm text-gray-700 flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-400" />
            Best Seller
          </label>
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button type="submit" disabled={saving}
          className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 disabled:opacity-50 transition-colors">
          {saving ? 'Menyimpan...' : editId ? 'Update Produk' : 'Tambah Produk'}
        </button>
        <button type="button" onClick={() => { resetForm(); setView('products'); }}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
          Batal
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <div className="hidden md:block w-56 flex-shrink-0">
        <div className="fixed w-56 h-screen">
          <Sidebar />
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-56 h-full">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-sm font-bold text-gray-900">JASA<span className="text-emerald-500">MIN</span> Admin</h1>
          <div className="w-8" />
        </div>

        <div className="p-4 md:p-6 max-w-5xl">
          {toastElement}
          {deleteTarget && (
            <ConfirmDialog
              title="Hapus Produk"
              message={`Apakah Anda yakin ingin menghapus "${deleteTarget.nama}"? Tindakan ini tidak dapat dibatalkan.`}
              onConfirm={handleDelete}
              onCancel={() => setDeleteTarget(null)}
            />
          )}

          {/* Dashboard view */}
          {view === 'dashboard' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-5">Dashboard</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Produk', value: products.length, color: 'emerald' },
                  { label: 'Best Seller', value: products.filter(p => p.badge_best_seller).length, color: 'amber' },
                  { label: 'Kategori', value: [...new Set(products.map(p => p.kategori))].length, color: 'blue' },
                  { label: 'Terbaru', value: products.filter(p => new Date(p.created_at) > new Date(Date.now() - 7 * 86400000)).length, color: 'rose' },
                ].map(stat => (
                  <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Produk Terbaru</h3>
                {products.slice(0, 5).map(p => (
                  <div key={p.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3 min-w-0">
                      {p.gambar ? <img src={p.gambar} alt="" className="w-8 h-8 rounded-lg object-cover" /> : <div className="w-8 h-8 rounded-lg bg-gray-100" />}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{p.nama}</p>
                        <p className="text-xs text-gray-400">{p.kategori}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-emerald-600 ml-2">{formatRupiah(p.harga)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products list view */}
          {(view === 'products') && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-5">Daftar Produk</h2>
              <div className="flex flex-wrap gap-3 mb-5">
                <div className="flex-1 min-w-[200px] relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Cari produk..." value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
                </div>
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                  className="px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400">
                  <option value="">Semua Kategori</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button onClick={() => { resetForm(); setView('add'); }}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-colors">
                  <Plus className="w-4 h-4" />
                  Tambah
                </button>
              </div>

              {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
                <div className="text-center py-12 text-sm text-gray-400">Tidak ada produk ditemukan</div>
              ) : (
                <div className="space-y-3">
                  {filtered.map(p => (
                    <div key={p.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:border-emerald-100 transition-colors">
                      {p.gambar ? (
                        <img src={p.gambar} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Package className="w-6 h-6 text-gray-300" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">{p.nama}</h3>
                          {p.badge_best_seller && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{p.kategori} &middot; {formatRupiah(p.harga)}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button onClick={() => startEdit(p)} className="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(p)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Add/Edit product view */}
          {(view === 'add' || view === 'edit') && <ProductForm />}
        </div>
      </div>
    </div>
  );
}
