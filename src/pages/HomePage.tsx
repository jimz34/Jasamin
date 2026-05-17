import { Link } from 'react-router-dom';
import { Zap, Shield, DollarSign, Star, ArrowRight, MessageCircle } from 'lucide-react';
import { getWhatsAppLink } from '../lib/constants';

const features = [
  { icon: Zap, title: 'Fast Response', desc: 'Respon cepat, proses instan tanpa menunggu lama.' },
  { icon: DollarSign, title: 'Harga Terjangkau', desc: 'Harga bersaing dengan kualitas terbaik di kelasnya.' },
  { icon: Shield, title: 'Aman & Terpercaya', desc: 'Transaksi aman, data terlindungi, layanan terjamin.' },
];

const testimonials = [
  { name: 'Andi S.', text: 'Pelayanan sangat cepat dan memuaskan. Harga juga sangat bersaing!', rating: 5 },
  { name: 'Rina W.', text: 'Sudah langganan untuk top up game. Selalu proses cepat dan aman.', rating: 5 },
  { name: 'Budi P.', text: 'Desain website yang dibuat sangat profesional. Recommended!', rating: 5 },
];

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-white to-white" />
        <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium mb-5">
              <Zap className="w-3 h-3" />
              Solusi Digital Terpercaya
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
              Jasa & Produk Digital{' '}
              <span className="text-emerald-500">Terpercaya</span>
            </h1>
            <p className="mt-4 text-gray-500 text-sm md:text-base leading-relaxed max-w-lg">
              Dapatkan jasa desain, top up game, hosting, dan pembuatan website dengan harga terjangkau dan pelayanan terbaik.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-all hover:shadow-lg hover:shadow-emerald-200"
              >
                Lihat Produk
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href={getWhatsAppLink('Konsultasi')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Hubungi Kami
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Mengapa Memilih Kami?</h2>
            <p className="mt-2 text-sm text-gray-500">Komitmen kami untuk memberikan yang terbaik</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-100 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                  <f.icon className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-100 shadow-sm">
            <div className="max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Tentang JASAMIN</h2>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-4">
                JASAMIN adalah platform jasa dan produk digital yang menyediakan berbagai layanan mulai dari desain grafis, top up game, hosting, hingga pembuatan website. Kami berkomitmen memberikan pelayanan terbaik dengan harga yang terjangkau.
              </p>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                Dengan pengalaman bertahun-tahun dan ratusan pelanggan puas, kami siap membantu mewujudkan kebutuhan digital Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Apa Kata Mereka?</h2>
            <p className="mt-2 text-sm text-gray-500">Testimoni dari pelanggan kami</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-600">
                    {t.name[0]}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
