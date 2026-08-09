'use client';

import ProposeTradeButton from './ProposeTradeButton';
import BuyItemButton from './BuyItemButton';
import type { Item } from './ItemCard';

export default function BrowseItemAction({ item, myItems, myId }: { item: Item; myItems: Item[]; myId: string }) {
  if (item.listing_type === 'sell') {
    return <BuyItemButton targetItem={item} myId={myId} />;
  }
  return <ProposeTradeButton targetItem={item} myItems={myItems} myId={myId} />;
}
