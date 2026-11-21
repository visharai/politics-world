import React from 'react';
import { LiveAdSlotBanner } from './LiveAdSlotBanner';
import { AdSlotKey } from '../data/adSlotsConfig';

interface InArticleAdBannerProps {
  onOpenMonetizationHub?: () => void;
  onBookSlot?: (slotKey: AdSlotKey) => void;
}

export const InArticleAdBanner: React.FC<InArticleAdBannerProps> = ({
  onOpenMonetizationHub,
  onBookSlot,
}) => {
  const handleBookInArticle = (slotKey: AdSlotKey) => {
    if (onBookSlot) {
      onBookSlot(slotKey);
    } else {
      onOpenMonetizationHub?.();
    }
  };

  return (
    <aside aria-label="In-Article Advertisement" className="my-7">
      <LiveAdSlotBanner
        slotKey="in-article"
        variant="editorial"
        onBookSlot={handleBookInArticle}
      />
    </aside>
  );
};
