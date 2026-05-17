import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-3">
              JASA<span className="text-emerald-400">MIN</span>
            </h3>
            <p className="text-sm leading-relaxed text-gray-400">
              Jasa & Produk Digital Terpercaya. Solusi digital untuk kebutuhan Anda dengan harga terjangkau dan pelayanan terbaik.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Kontak</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>0895-3922-30443</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>admin@jasamin.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Indonesia</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Layanan</h4>
            <ul className="space-y-1.5 text-sm text-gray-400">
              <li>Jasa Desain</li>
              <li>Top Up Game</li>
              <li>Hosting & Domain</li>
              <li>Pembuatan Website</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} JASAMIN. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
