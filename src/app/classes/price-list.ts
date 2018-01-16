/**
 * Price list class
 * @author Daniel Sogl
 */
export class PriceList {
  /** Download prices */
  downloadItems: DownloadPrice[];
  /** Printing house prices */
  printingHouseItems: PrintingHousePrices[];
  /** User UID */
  user: string;

  constructor(user: string) {
    this.user = user;
    this.downloadItems = [
      {
        name: 'XXS (max. 400px)',
        minPrice: 3.5,
        price: 3.5
      },
      {
        name: 'XS (max. 600px)',
        minPrice: 3.5,
        price: 3.5
      },
      {
        name: 'S (max. 800px)',
        minPrice: 5,
        price: 5
      },
      {
        name: 'M (max. 1200px)',
        minPrice: 8,
        price: 8
      },
      {
        name: 'L (max. 3000px)',
        minPrice: 13,
        price: 13
      },
      {
        name: 'XL (max. 5000px)',
        minPrice: 18,
        price: 18
      },
      {
        name: 'Original',
        minPrice: 20,
        price: 20
      }
    ];
  }
}

/**
 * Download item interface
 * @author Daniel Sogl
 */
export interface DownloadPrice {
  /** Minimal price */
  minPrice: number;
  /** Item name */
  name: string;
  /** Constomer price */
  price: number;
}

/**
 * Printing House Item Interface
 * @author Daniel Sogl
 */
export interface PrintingHousePrices {
  /** Price type */
  name: PRINTTYPE;
  /** Articles */
  articles: PrintingHouseArticle[];
}

/**
 * Printing House Article Interface
 * @author Daniel Sogl
 */
export interface PrintingHouseArticle {
  /** Image heigh */
  heigh: number;
  /** Minimal price */
  minPrice: number;
  /** Image name */
  name: string;
  /** Costomer price */
  price: number;
  /** Image width */
  width: number;
}

/**
 * Print type enum
 * @author Daniel Sogl
 */
export enum PRINTTYPE {
  PICTURE = 'Pictures'
}