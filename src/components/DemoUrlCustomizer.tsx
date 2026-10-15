import { useState } from 'react';
import { Sliders, Copy, Check, ExternalLink, X, RotateCcw, Sparkles } from 'lucide-react';
import { CompanyConfig } from '../types/config';
import { NICHE_PRESETS } from '../data/defaultConfig';

interface DemoUrlCustomizerProps {
  config: CompanyConfig;
  isOpen: boolean;
  onClose: () => void;
  onUpdateConfig: (newConfig: Partial<CompanyConfig>) => void;
}

export function DemoUrlCustomizer({
  config,
  isOpen,
  onClose,
  onUpdateConfig
}: DemoUrlCustomizerProps) {
  const [formData, setFormData] = useState({
    name: config.name,
    owner: config.owner,
    niche: config.niche,
    city: config.city,
    phone: config.phone,
    color: config.color,
    webhook: config.webhook
  });

  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate URL params
  const generateUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
    const params = new URLSearchParams();
    params.set('name', formData.name);
    params.set('owner', formData.owner);
    params.set('city', formData.city);
    params.set('phone', formData.phone);
    params.set('color', formData.color);
    if (formData.webhook) {
      params.set('webhook', formData.webhook);
    }
    return `${origin}?${params.toString()}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyPreset = (presetName: string) => {
    const preset = NICHE_PRESETS[presetName];
    if (preset) {
      const merged = {
        ...formData,
        ...preset,
        name: preset.name || formData.name,
        owner: preset.owner || formData.owner,
        niche: preset.niche || formData.niche,
        city: preset.city || formData.city,
        phone: preset.phone || formData.phone,
        color: preset.color || formData.color
      };
      setFormData(merged);
      onUpdateConfig(merged);
    }
  };

  const handleFormChange = (key: string, value: string) => {
    const updated = { ...formData, [key]: value };
    setFormData(updated);
  };

  const handleApplyNow = () => {
    onUpdateConfig(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Prospect Demo URL Generator (Section 3.2)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Create a customized prototype link for any roofing or home-service company in 10 seconds.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
          
          {/* 1-Click Presets */}
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Instant 1-Click Presets:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.keys(NICHE_PRESETS).map((pName) => (
                <button
                  key={pName}
                  type="button"
                  onClick={() => handleApplyPreset(pName)}
                  className="px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-slate-800 text-left transition-all cursor-pointer"
                >
                  <div className="font-bold text-slate-900 dark:text-white text-xs truncate">
                    {pName}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {NICHE_PRESETS[pName].city}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Company Name (`name`)
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                placeholder="e.g. Apex Roofing Co."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Owner's First Name (`owner`)
              </label>
              <input
                type="text"
                value={formData.owner}
                onChange={(e) => handleFormChange('owner', e.target.value)}
                placeholder="e.g. Mike"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                City / Market (`city`)
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleFormChange('city', e.target.value)}
                placeholder="e.g. Dallas, TX"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number (`phone`)
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleFormChange('phone', e.target.value)}
                placeholder="e.g. (214) 555-0142"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Brand Color (`color` hex)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => handleFormChange('color', e.target.value)}
                  className="w-9 h-9 rounded cursor-pointer border-0 p-0"
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => handleFormChange('color', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Primary Niche / Category
              </label>
              <input
                type="text"
                value={formData.niche}
                onChange={(e) => handleFormChange('niche', e.target.value)}
                placeholder="e.g. Roofing & Storm Damage"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          {/* Live Webhook Toggle (Demo Mode vs Live Mode per Section 5) */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
              n8n Webhook URL (`webhook`)
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
              Empty = <strong>Demo Mode</strong> (prototype banner shown, sample tags visible).
              Populated = <strong>Live Mode</strong> (demo labels removed, real n8n webhook triggered).
            </p>
            <input
              type="text"
              value={formData.webhook}
              onChange={(e) => handleFormChange('webhook', e.target.value)}
              placeholder="Leave empty for Demo Mode, or paste https://n8n.example.com/webhook/..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono"
            />
          </div>

          {/* Shareable Link Box */}
          <div className="p-4 rounded-xl bg-slate-950 text-slate-200 border border-slate-800">
            <div className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider mb-1">
              Shareable Prospect Demo Link:
            </div>
            <div className="font-mono text-xs break-all text-slate-300 bg-slate-900 p-2.5 rounded border border-slate-800 mb-3 select-all">
              {generateUrl()}
            </div>
            <button
              onClick={handleCopy}
              className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Prospect Demo Link'}</span>
            </button>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              setFormData({
                name: "Summit Ridge Roofing",
                owner: "Mike",
                niche: "Roofing & Storm Damage Restoration",
                city: "Dallas, TX",
                phone: "(214) 555-0142",
                color: "#1e3a8a",
                webhook: ""
              });
            }}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyNow}
              className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold transition-colors cursor-pointer"
            >
              Apply to Current Page
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
