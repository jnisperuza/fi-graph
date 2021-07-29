import { Card } from "../Card/config";

export const DOWNLOAD_BUTTONS = '[data-layoutid="layout_226"]';
export const FILTER_PANEL = '.side';

export interface Dashboard {
    selectedCard?: Card;
    refresh?: () => void;
    handleViewMore?: () => void;
}