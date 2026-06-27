import type { VerticalId } from "@/types/vertical";
import * as eatsCart from "@/copy/eats/cartDrawer_Copy";
import * as eatsCheckout from "@/copy/eats/checkout_Copy";
import * as eatsOrder from "@/copy/eats/order_Copy";
import * as eatsStorefront from "@/copy/eats/storefront_Copy";
import * as flixCart from "@/copy/flix/cartDrawer_Copy";
import * as flixCheckout from "@/copy/flix/checkout_Copy";
import * as flixOrder from "@/copy/flix/order_Copy";
import * as flixStorefront from "@/copy/flix/storefront_Copy";
import * as homesCart from "@/copy/homes/cartDrawer_Copy";
import * as homesCheckout from "@/copy/homes/checkout_Copy";
import * as homesOrder from "@/copy/homes/order_Copy";
import * as homesStorefront from "@/copy/homes/storefront_Copy";
import * as hypeCart from "@/copy/hype/cartDrawer_Copy";
import * as hypeCheckout from "@/copy/hype/checkout_Copy";
import * as hypeOrder from "@/copy/hype/order_Copy";
import * as hypeStorefront from "@/copy/hype/storefront_Copy";
import { eatsCatalog } from "@/data/catalogs/eats";
import { flixCatalog } from "@/data/catalogs/flix";
import { homesCatalog } from "@/data/catalogs/homes";
import { hypeCatalog } from "@/data/catalogs/hype";
import type { Catalog, MastheadSlide } from "@/types/menu";

export interface VerticalCopy {
  storefront: {
    heroTagline: string;
    heroSubtitle: string;
    heroImageUrl: string;
    verticalLabel: string;
    homeSectionHeading: string;
    activeOrdersHeading: string;
    activeOrdersTrackLabel: string;
    activeOrdersItemCountSuffix: string;
    etaMinutesSuffix: string;
    categoryFilterAriaLabel: string;
    categoryAllLabel: string;
    addButtonLabel: string;
    maxQuantityReachedMessage: string;
  };
  cartDrawer: {
    cartDrawerTitle: string;
    cartDrawerCloseAriaLabel: string;
    sabrOneBannerHeadline: string;
    sabrOneBannerCta: string;
    cartEmptyMessage: string;
    cartEmptySubtext: string;
    subtotalLabel: string;
    checkoutCtaLabel: string;
    quantityDecreaseAriaLabel: string;
    quantityIncreaseAriaLabel: string;
  };
  checkout: {
    checkoutPageTitle: string;
    orderSummaryHeading: string;
    priorityDeliveryLabel: string;
    priorityDeliveryPriceSuffix: string;
    priorityDeliveryDescription: string;
    priorityOffShamePrimary: string;
    priorityOffShameSecondary: string;
    tipHeading: string;
    tipMostCommonBadge: string;
    taxesAccordionLabel: string;
    smallThoughtFeeLabel: string;
    serviceFeeLabel: string;
    totalLabel: string;
    placeOrderButtonLabel: string;
    emptyCartTitle: string;
    emptyCartDescription: string;
    emptyCartCtaLabel: string;
    subtotalLabel: string;
  };
  order: {
    trackingPageTitle: string;
    etaLabel: string;
    etaMinutesSuffix: string;
    estimatedArrivalLabel: string;
    deliveryPhasePreparingLabel: string;
    deliveryPhasePreparingDetail: string;
    deliveryPhasePickedUpLabel: string;
    deliveryPhasePickedUpDetail: string;
    deliveryPhaseOnTheWayLabel: string;
    deliveryPhaseOnTheWayMessages: readonly string[];
    deliveryPhaseDelayedLabel: string;
    satirePauseMessages: readonly string[];
    locationLoadingMessage: string;
    routingLoadingMessage: string;
    locationDeniedMessage: string;
    giveUpButtonLabel: string;
    backToMenuLabel: string;
    receiptHeading: string;
    receiptOrderNumberPrefix: string;
    receiptDeliveredLabel: string;
    receiptPayloadHeading: string;
    riddleAnswerPrefix: string;
    receiptFooterMessage: string;
    receiptPriorityDeliveryLabel: string;
    receiptTaxesLabel: string;
    receiptTipLabel: string;
    receiptTotalLabel: string;
  };
}

export interface VerticalConfig {
  id: VerticalId;
  enabled: boolean;
  catalog: Catalog;
  copy: VerticalCopy;
}

const verticalConfigs: Record<VerticalId, VerticalConfig> = {
  eats: {
    id: "eats",
    enabled: true,
    catalog: eatsCatalog,
    copy: {
      storefront: eatsStorefront,
      cartDrawer: eatsCart,
      checkout: eatsCheckout,
      order: eatsOrder,
    },
  },
  hype: {
    id: "hype",
    enabled: true,
    catalog: hypeCatalog,
    copy: {
      storefront: hypeStorefront,
      cartDrawer: hypeCart,
      checkout: hypeCheckout,
      order: hypeOrder,
    } as VerticalCopy,
  },
  homes: {
    id: "homes",
    enabled: true,
    catalog: homesCatalog,
    copy: {
      storefront: homesStorefront,
      cartDrawer: homesCart,
      checkout: homesCheckout,
      order: homesOrder,
    } as VerticalCopy,
  },
  flix: {
    id: "flix",
    enabled: false,
    catalog: flixCatalog,
    copy: {
      storefront: flixStorefront,
      cartDrawer: flixCart,
      checkout: flixCheckout,
      order: flixOrder,
    } as VerticalCopy,
  },
};

export function getVerticalConfig(vertical: VerticalId): VerticalConfig {
  return verticalConfigs[vertical];
}

export function isVerticalEnabled(vertical: VerticalId): boolean {
  return verticalConfigs[vertical].enabled;
}

export function getActiveVerticalConfigs(): VerticalConfig[] {
  return Object.values(verticalConfigs).filter((config) => config.enabled);
}

export function getAllVerticalConfigs(): VerticalConfig[] {
  return Object.values(verticalConfigs);
}

export function getMastheadSlides(): MastheadSlide[] {
  return getActiveVerticalConfigs().map(({ id, copy }) => ({
    vertical: id,
    imageUrl: copy.storefront.heroImageUrl,
    tagline: copy.storefront.heroTagline,
    subtitle: copy.storefront.heroSubtitle,
    verticalLabel: copy.storefront.verticalLabel,
  }));
}

export function getMixedHomeItems() {
  const buckets = getActiveVerticalConfigs().map((config) => config.catalog.items);
  const mixed = [];
  const maxLen = Math.max(0, ...buckets.map((items) => items.length));

  for (let index = 0; index < maxLen; index += 1) {
    for (const items of buckets) {
      if (items[index]) {
        mixed.push(items[index]);
      }
    }
  }

  return mixed;
}

export function getAllCatalogItems() {
  return getActiveVerticalConfigs().flatMap((config) => config.catalog.items);
}

export function getCatalog(vertical: VerticalId): Catalog {
  return verticalConfigs[vertical].catalog;
}

export function getVerticalCopy(vertical: VerticalId): VerticalCopy {
  return verticalConfigs[vertical].copy;
}
