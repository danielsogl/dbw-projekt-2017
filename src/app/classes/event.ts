/**
 * Event class
 * @author Daniel Sogl
 */
export class Event {
  /** Date */
  date: string;
  /** Description */
  description?: string;
  /** ID */
  id: string;
  /** Location */
  location: string;
  /** Name */
  name: string;
  /** Password */
  password?: string;
  /** Photographer UID */
  photographerUid: string;
  /** Public */
  public: boolean;
  /** Ratings */
  ratings: number;
  /** I sdeleted */
  deleted: boolean;

  /**
   * Constructor
   * @param  {any} eventData
   */
  constructor(eventData: any) {
    this.date = eventData.date;
    this.description = '';
    this.id = eventData.id;
    this.location = eventData.location;
    this.name = eventData.name;
    this.password = null;
    this.photographerUid = eventData.photographerUid;
    this.public = false;
    this.ratings = 0;
    this.deleted = false;
  }
}
