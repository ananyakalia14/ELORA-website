import React from 'react';
import { ShieldCheck, Sparkles, Feather, Droplets } from 'lucide-react';

const iconMap = {
  ShieldCheck: ShieldCheck,
  Sparkles: Sparkles,
  Feather: Feather,
  Droplets: Droplets,
};

export default function TrustBar() {
  const badges = [
    {
      title: 'Dermatologist Approved',
      subtitle: 'Formulated for sensitive skin protocols',
      icon: 'ShieldCheck',
    },
    {
      title: '94% Saw Brighter Skin',
      subtitle: 'Double-blind 28-day clinical trial',
      icon: 'Sparkles',
    },
    {
      title: 'Vegan & Cruelty-Free',
      subtitle: 'Clean botanical Leaping Bunny standard',
      icon: 'Feather',
    },
    {
      title: 'Recyclable French Glass',
      subtitle: 'UV-protective sustainable packaging',
      icon: 'Droplets',
    },
  ];

  return (
    <div className="trust-bar" aria-label="Brand Certifications and Clinical Proof">
      <div className="trust-bar-container">
        {badges.map((item, idx) => {
          const IconComponent = iconMap[item.icon] || Sparkles;
          return (
            <div key={idx} className="trust-badge-item">
              <div className="trust-icon-box">
                <IconComponent size={18} strokeWidth={1.75} />
              </div>
              <div>
                <p className="trust-badge-title">{item.title}</p>
                <p className="trust-badge-subtitle">{item.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
