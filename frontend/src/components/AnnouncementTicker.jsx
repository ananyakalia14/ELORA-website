import React, { useState } from 'react';
import { Play, Pause } from 'lucide-react';

/**
 * Top Utility Announcement Bar
 * Displays: "COMPLIMENTARY TRAVEL ELIXIR ON ALL ORDERS OVER $75"
 * Includes a subtle pause/play toggle on the far right.
 */
export default function AnnouncementTicker() {
  const [isPlaying, setIsPlaying] = useState(true);

  const messages = [
    "COMPLIMENTARY TRAVEL ELIXIR ON ALL ORDERS OVER $75",
    "DERMATOLOGIST FORMULATED • SMALL-BATCH BOTANICAL EDITIONS",
    "ENJOY COMPLIMENTARY 2-DELUXE SAMPLES WITH EVERY RITUAL",
  ];

  return (
    <aside className="top-utility-bar" aria-label="Store Announcement">
      <div className="utility-bar-inner">
        {/* Left spacer to balance center alignment */}
        <div className="utility-bar-spacer" aria-hidden="true" />

        {/* Center announcement text */}
        <div className="utility-bar-center">
          <div className={`utility-ticker-track ${isPlaying ? 'is-playing' : 'is-paused'}`}>
            <span className="utility-message">
              COMPLIMENTARY TRAVEL ELIXIR ON ALL ORDERS OVER $75 &bull;&nbsp;
            </span>
            <span className="utility-message">
              COMPLIMENTARY TRAVEL ELIXIR ON ALL ORDERS OVER $75 &bull;&nbsp;
            </span>
            <span className="utility-message">
              COMPLIMENTARY TRAVEL ELIXIR ON ALL ORDERS OVER $75 &bull;&nbsp;
            </span>
          </div>
        </div>

        {/* Right Pause/Play Toggle Button */}
        <div className="utility-bar-right">
          <button
            className="utility-toggle-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pause announcement" : "Play announcement"}
            aria-label={isPlaying ? "Pause announcement ticker" : "Play announcement ticker"}
          >
            {isPlaying ? <Pause size={11} /> : <Play size={11} />}
          </button>
        </div>
      </div>
    </aside>
  );
}
