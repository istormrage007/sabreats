export const MAX_QUANTITY_PER_ITEM = 10;
export const MAX_LINE_ITEMS = 20;
export const PRIORITY_DELIVERY_FEE = 49;
export const SMALL_THOUGHT_FEE = 12;
export const SERVICE_FEE = 18;
export const TIP_OPTIONS = [0, 20, 30, 50] as const;
export const DEFAULT_TIP_INDEX = 2;
export const ORDER_STORAGE_KEY = "sabr-order-summary";
export const ORDERS_STORAGE_KEY = "sabr-orders";
export const MAX_TRACKABLE_ORDERS = 3;
export const ORDERS_CHANGED_EVENT = "sabr-orders-changed";

/** How often live tracking re-syncs scooter + progress bar to the delivery clock */
export const DELIVERY_PROGRESS_TICK_MS = 250;
export const OSRM_REQUEST_TIMEOUT_MS = 8000;

export const CARTO_DARK_TILE_URL =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

export const CARTO_LIGHT_TILE_URL =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

/** @deprecated Use CARTO_DARK_TILE_URL or theme-aware selection */
export const CARTO_TILE_URL = CARTO_DARK_TILE_URL;

export const CARTO_TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

export const OSRM_BASE_URL = "https://router.project-osrm.org";

export const DEFAULT_ESTIMATED_DELIVERY_MINUTES = 2;
export const MAX_DELIVERY_MINUTES = 2;
export const PRIORITY_ETA_REDUCTION_MINUTES = 1;
export const ETA_MINIMUM_MINUTES = 0;
/** @deprecated Deadline-based ETA; kept for compatibility */
export const ETA_SECONDS_PER_DISPLAY_MINUTE = 60;
export const ETA_PAUSE_BONUS_MINUTES = 0;
