import React, { useState } from 'react';

export default function SupplyModal({ isOpen, onClose }) {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [generatedToken, setGeneratedToken] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleTokenGeneration = (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setLoading(true);
    setTimeout(() => {
      // Formats an anonymous hex token string safely
      const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
      setGeneratedToken(`MSC-${selectedProduct.substring(0, 3).toUpperCase()}-${randomHex}`);
      setLoading(false);
    }, 800);
  };

  const resetModal = () => {
    setSelectedProduct('');
    setGeneratedToken('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden transition-all scale-100">
        
        {/* Modal Window Header */}
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Secure Commodity Dispenser</span>
            <h3 className="text-sm font-black text-slate-900 mt-0.5">Generate Discrete Token</h3>
          </div>
          <button onClick={resetModal} className="text-slate-400 hover:text-slate-600 font-mono text-base">&times;</button>
        </div>

        {/* Operational Core Form Content */}
        <div className="p-6">
          {!generatedToken ? (
            <form onSubmit={handleTokenGeneration} className="space-y-4">
              <p className="text-xs text-slate-500 font-bold leading-relaxed">
                Select your product kit package below. The platform will issue an encrypted pickup alphanumeric hash code sequence to clear automated lockers anonymously.
              </p>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Package Selection</label>
                <select 
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-500 transition-all text-slate-700"
                  required
                >
                  <option value="">-- Choose a Discrete Wellness Bundle --</option>
                  <option value="Condoms">External/Internal Barrier Pack (Condoms + Water-based Lube)</option>
                  <option value="PrEP Intake">Oral PrEP Initial 30-Day Dispensing Bottle</option>
                  <option value="HIV Self-Test">Rapid Oral/Blood Fluid Diagnostic Testing Kit</option>
                </select>
              </div>

              <div className="bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-xl flex items-start space-x-2.5">
                <span className="text-base">🛡️</span>
                <p className="text-[11px] text-emerald-800 font-bold leading-normal">
                  Zero metrics are bound to your student network file profiles. Voucher claims remain fully unlinked.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !selectedProduct}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white font-black text-xs py-3 rounded-xl transition-all shadow-md shadow-emerald-100 cursor-pointer text-center"
              >
                {loading ? "Encoding Secure Matrix Node..." : "Generate Safe Pickup Code &rarr;"}
              </button>
            </form>
          ) : (
            <div className="space-y-5 text-center py-2 animate-fadeIn">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xl mx-auto shadow-sm">
                ✓
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-900">Encrypted Fulfillment Identifier Issued</h4>
                <p className="text-[11px] text-slate-400 font-bold">Present this code at any automated Campus Locker Hub</p>
              </div>

              {/* Code Voucher Display Box */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 font-mono text-base font-black tracking-widest text-[#4C1D95] select-text shadow-inner">
                {generatedToken}
              </div>

              <div className="text-left bg-amber-50 border border-amber-100 rounded-xl p-3 text-[10px] font-bold text-amber-800 leading-relaxed">
                ⚠️ <strong>Security Note:</strong> Screenshot or note down this transaction string directly now. This session variable clears immediately when clicking finish.
              </div>

              <button
                onClick={resetModal}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Clear Session & Close Window
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}