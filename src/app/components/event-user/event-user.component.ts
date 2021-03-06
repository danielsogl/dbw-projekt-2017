import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { ModalDirective } from 'ng-mdb-pro/free/modals/modal.directive';
import { Log } from 'ng2-logger';

import { Event } from '../../classes/event';
import { PriceList } from '../../classes/price-list';
import { User } from '../../classes/user';
import { EventPicture } from '../../interfaces/event-picture';
import { PhotographerProfile } from '../../interfaces/photographer-profile';
import { FirebaseFirestoreService } from '../../services/firebase/firestore/firebase-firestore.service';

/**
 * Event user view component
 * @author Daniel Sogl, Markus Kirschner, Tim Krießler
 */
@Component({
  selector: 'app-event-user',
  templateUrl: './event-user.component.html',
  styleUrls: ['./event-user.component.scss']
})
export class EventUserComponent implements OnInit {
  /** Logger */
  private log = Log.create('EventUserComponent');

  /** Event Object */
  @Input() public event: Event;
  /** User Object */
  @Input() public user: User;

  /** TemplateRef pictureModal */
  @ViewChild('pictureModal') pictureModal: any;
  /** TemplateRef reportImageModal */
  @ViewChild('reportImageModal') reportImageModal: ModalDirective;
  /** TemplateRef imgBigOverview */
  @ViewChild('imgBigOverview') imgBigOverview: TemplateRef<any>;
  /** TemplateRef imgSmalOverview */
  @ViewChild('imgSmalOverview') imgSmalOverview: TemplateRef<any>;
  /** TemplateRef imgBigOverview */
  @ViewChild('imgBigMarked') imgBigMarked: TemplateRef<any>;
  /** TemplateRef imgSmalOverview */
  @ViewChild('imgSmalMarked') imgSmalMarked: TemplateRef<any>;

  /** Template ref  */
  public templateOverview: TemplateRef<any>;
  /** Template ref */
  public templateMarked: TemplateRef<any>;

  /** Printing house object */
  public priceList: PriceList;
  /** Event images array */
  public images: EventPicture[];
  /** owner of event */
  public photographer: PhotographerProfile;

  /**
   * Constructor
   * @param  {FirebaseFirestoreService} afs Angular Firestore Service
   */
  constructor(private afs: FirebaseFirestoreService) {}

  /**
   * Initialize component
   */
  ngOnInit() {
    this.log.color = 'orange';
    this.log.d('Component initialized');

    this.log.d('Event', this.event);
    this.log.d('User', this.user);

    this.templateOverview = this.imgBigOverview;
    this.templateMarked = this.imgBigMarked;

    // Load images
    if (this.event) {
      this.afs
        .getPhotographerProfile(this.event.photographerUid)
        .valueChanges()
        .subscribe(photographer => {
          this.photographer = photographer;
        });

      this.afs
        .getEventPictures(this.event.id)
        .valueChanges()
        .map((images: EventPicture[]) => {
          for (let i = 0; i < images.length; i++) {
            images[i].selected = false;
          }
          return images;
        })
        .subscribe(images => {
          this.images = images;
          this.log.d('Event images', this.images);
        });

      this.afs
        .getPriceList(this.event.photographerUid)
        .valueChanges()
        .subscribe(priceList => {
          if (priceList) {
            this.priceList = priceList;
            this.log.d('Loaded priceList', this.priceList);
          }
        });
    }
  }

  /**
   * Open image detail modal
   * @param  {EventPicture} image Image to open
   */
  openImageModal(image: EventPicture, imageIndex: number) {
    this.pictureModal.showModal(
      image,
      imageIndex,
      this.images.length,
      this,
      this.priceList
    );
  }

  /**
   * Select all images
   */
  selectAllImages() {
    for (let i = 0; i < this.images.length; i++) {
      this.images[i].selected = true;
    }
  }

  /**
   * Deselect all images
   */
  deselectAllImages() {
    for (let i = 0; i < this.images.length; i++) {
      this.images[i].selected = false;
    }
  }

  /**
   * Upvote image
   * @param  {EventPicture} image Image object
   */
  rateImage(image: EventPicture) {
    if (this.user) {
      image.ratings++;
      this.afs
        .updateImage(image)
        .then(() => {
          this.log.d('Upvoted image');
        })
        .catch(err => {
          this.log.er('Error upvoting image', err);
        });
    } else {
      window.alert('Sign in to rate images');
    }
  }

  /**
   * Report image
   * @param  {EventPicture} image Image object
   */
  reportImage(image: EventPicture) {
    this.reportImageModal.show();
  }

  getFollowingImage(imageIndex: number) {
    return this.images[imageIndex];
  }
}
