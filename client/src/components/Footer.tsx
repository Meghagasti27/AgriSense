import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-black rounded-t-4xl drop-shadow-[0_0_25px_rgba(34,197,94,0.6)] mt-10">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center">
                <img src="/logo.svg" alt="logo of Agri sense" />
              </div>
              <span className="text-2xl font-bold">AgriSense</span>
            </div>
            <p className="text-slate-900 leading-relaxed">
              Empowering farmers with AI-driven insights for smarter crop selection and higher yields.
            </p>
            {/* Social Links */}
            <div className="flex gap-3 pt-4">
              <a href="#" className="w-10 h-10 bg-slate-200 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-200 hover:bg-blue-400 rounded-lg flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-200 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-200 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Product</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-900 hover:text-slate-500 transition-colors">Features</a></li>
              <li><a href="#" className="text-slate-900 hover:text-slate-500 transition-colors">Pricing</a></li>
              <li><a href="#" className="text-slate-900 hover:text-slate-500 transition-colors">AI Models</a></li>
              <li><a href="#" className="text-slate-900 hover:text-slate-500 transition-colors">Case Studies</a></li>
              <li><a href="#" className="text-slate-900 hover:text-slate-500 transition-colors">Testimonials</a></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-900 hover:text-slate-500 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-slate-900 hover:text-slate-500 transition-colors">Blog</a></li>
              <li><a href="#" className="text-slate-900 hover:text-slate-500 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-slate-900 hover:text-slate-500 transition-colors">Community</a></li>
              <li><a href="#" className="text-slate-900 hover:text-slate-500 transition-colors">API Reference</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-green-400 mt-1 shrink-0" />
                <a href="mailto:support@cropai.com" className="text-slate-900 hover:text-slate-500 transition-colors">
                  support@agrisense.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-green-400 mt-1 shrink-0" />
                <a href="tel:+1234567890" className="text-slate-900 hover:text-slate-500 transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-400 mt-1 shrink-0" />
                <span className="text-slate-900">
                  123 Agriculture Street<br />
                  Farm Valley, CA 90210
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-green-300">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-900 text-sm">
              © {currentYear} AgriSense. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-slate-900 hover:text-slate-500 transition-colors">Privacy Policy</a>
              <a href="#" className="text-slate-900 hover:text-slate-500 transition-colors">Terms of Service</a>
              <a href="#" className="text-slate-900 hover:text-slate-500 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}