import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { ModalDirective } from 'ng-mdb-pro/free/modals/modal.directive';
import { Log } from 'ng2-logger';
import { Observable } from 'rxjs/Observable';

import { Event } from '../../classes/event';
import { User } from '../../classes/user';
import { PhotographerProfile } from '../../interfaces/photographer-profile';
import { FirebaseAuthService } from '../../services/auth/firebase-auth/firebase-auth.service';
import { FirebaseFirestoreService } from '../../services/firebase/firestore/firebase-firestore.service';
import { GeolocationService } from '../../services/geolocation/geolocation.service';

/**
 * Photographer dashboard component
 * @author Daniel Sogl
 */
@Component({
  selector: 'app-dashboard-photographer',
  templateUrl: './dashboard-photographer.component.html',
  styleUrls: ['./dashboard-photographer.component.scss']
})
export class DashboardPhotographerComponent implements OnInit {
  /** Logger */
  private log = Log.create('DashboardPhotographerComponent');

  /** Firebase user */
  public user: User;

  /** Can create a new event */
  public canCreateEvent: boolean;

  /** New event form */
  public newEventForm: FormGroup;

  /** Account data form */
  public accountDataForm: FormGroup;

  /** Billing Address Form */
  public billingAddressForm: FormGroup;

  /** Public profile data form */
  public publicProfileForm: FormGroup;

  /** Printing house contact data form */
  public printingHouseContactForm: FormGroup;

  /** Edited event */
  public eventEdit: Event;

  /** Events firebase collection */
  public eventCollection: AngularFirestoreCollection<Event>;
  /** Photographer events */
  public events: Observable<Event[]>;
  /** Photographer profile document */
  public photographerProfileDoc: AngularFirestoreDocument<PhotographerProfile>;
  /** Photographer profile */
  public photographerProfile: PhotographerProfile = {
    about: '',
    email: '',
    facebook: '',
    instagram: '',
    name: '',
    phone: '',
    tumbler: '',
    twitter: '',
    uid: '',
    website: '',
    premium: false,
    location: {
      lat: 0,
      lng: 0
    }
  };

  /** Create new event modal */
  @ViewChild('newEventModal') public newEventModal: ModalDirective;
  /** User not validated Modal */
  @ViewChild('notValidatedModal') public notValidatedModal: ModalDirective;
  /** Event limit modal */
  @ViewChild('eventLimitModal') public eventLimitModal: ModalDirective;

  /**
   * Constructor
   * @param {FirebaseAuthService} auth Firebase Auth Service
   * @param {FirebaseFirestoreService} afs Firebase Firestore Service
   * @param {Router} router Router
   * @param {FormBuilder} formBuilder FormBuilder
   * @param {GeolocationService} geolocation Geolocation Service
   */
  constructor(
    private auth: FirebaseAuthService,
    private afs: FirebaseFirestoreService,
    private router: Router,
    private formBuilder: FormBuilder,
    private geolocation: GeolocationService
  ) {
    this.newEventForm = this.formBuilder.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      date: ['', Validators.required]
    });

    this.accountDataForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.email]
    });

    this.billingAddressForm = this.formBuilder.group({
      city: ['', Validators.required],
      company: [''],
      email: ['', Validators.email],
      name: [''],
      lastname: [''],
      phone: ['', Validators.required],
      street: ['', Validators.required],
      streetnumber: ['', Validators.required],
      zip: ['', Validators.required]
    });

    this.publicProfileForm = this.formBuilder.group({
      about: [''],
      email: ['', Validators.required],
      facebook: [''],
      instagram: [''],
      name: ['', Validators.required],
      phone: [''],
      tumbler: [''],
      twitter: [''],
      uid: [''],
      website: [''],
      photoUrl: [''],
      location: this.formBuilder.group({
        lat: [0],
        lng: [0]
      }),
      address: this.formBuilder.group({
        city: [''],
        company: [''],
        email: [''],
        name: [''],
        lastname: [''],
        phone: [''],
        street: [''],
        streetnumber: [''],
        zip: ['']
      })
    });
  }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.log.color = 'orange';
    this.log.d('Component initialized');

    this.auth.user.subscribe(user => {
      if (user) {
        this.user = user;
        this.photographerProfile.premium = user.subscription.premium;
        this.log.d('Loaded user', user);

        this.accountDataForm.setValue({
          name: this.user.name,
          lastname: this.user.lastname,
          email: this.user.email
        });

        this.billingAddressForm.setValue(this.user.billingAdress);

        if (!user.isValidated) {
          this.notValidatedModal.show();
        }
        if (this.user.eventsLeft > 0) {
          this.canCreateEvent = true;
        } else {
          this.canCreateEvent = false;
        }
      }
    });

    if (this.auth.getCurrentFirebaseUser()) {
      this.photographerProfileDoc = this.afs.getPhotographerProfile(
        this.auth.getCurrentFirebaseUser().uid
      );

      this.photographerProfileDoc.valueChanges().subscribe(profile => {
        if (profile) {
          this.photographerProfile = profile;
          this.log.d('Photographer Profile', profile);

          if (!this.photographerProfile.address) {
            this.photographerProfile.address = this.user.billingAdress;
          }
          this.photographerProfile.photoUrl = this.auth.getCurrentFirebaseUser().photoURL;
          this.photographerProfile.uid = this.user.uid;
          this.publicProfileForm.patchValue(this.photographerProfile);
        }
      });

      this.eventCollection = this.afs.getPhotographerEvents(
        this.auth.getCurrentFirebaseUser().uid
      );
      this.events = this.eventCollection.valueChanges();
    }
  }

  /**
   * Create new event
   */
  createNewEvent() {
    if (!this.user.isValidated) {
      this.notValidatedModal.show();
    } else if (this.canCreateEvent) {
      this.newEventModal.show();
    } else {
      this.eventLimitModal.show();
      this.log.d('User can not create another event without upgrading');
    }
  }

  /**
   * Save event
   */
  saveEvent() {
    if (this.newEventForm.valid) {
      const uid = this.afs.getId();
      const event = new Event({
        date: this.newEventForm.value.date,
        id: uid,
        location: this.newEventForm.value.location,
        name: this.newEventForm.value.name,
        photographerUid: this.user.uid
      });
      this.eventCollection
        .doc(uid)
        .set(JSON.parse(JSON.stringify(event)))
        .then(() => {
          this.log.d('Added new event to firestore');
          this.newEventModal.hide();
          this.newEventForm.reset();
          this.newEventForm.markAsUntouched();
        })
        .catch(err => {
          this.newEventModal.hide();
          this.newEventForm.reset();
          this.newEventForm.markAsUntouched();
          this.log.er('Could not save event to firestore', err);
        });
    } else {
      this.log.er('Form is invalid');
    }
  }

  /**
   * Update user data
   */
  updateProfile() {
    if (
      (this.billingAddressForm.valid && !this.billingAddressForm.untouched) ||
      (this.accountDataForm.valid && !this.accountDataForm.untouched)
    ) {
      if (this.billingAddressForm.valid && !this.billingAddressForm.untouched) {
        this.user.billingAdress = this.billingAddressForm.getRawValue();
      }
      if (this.accountDataForm.valid && !this.accountDataForm.untouched) {
        this.user.name = this.accountDataForm.value.name;
        this.user.lastname = this.accountDataForm.value.lastname;
        this.user.email = this.accountDataForm.value.email;
      }

      this.log.d('Update user data', this.user);
      this.afs
        .updateUserData(this.user)
        .then(() => {
          this.log.d('Updated user');
          this.accountDataForm.markAsUntouched();
          this.billingAddressForm.markAsUntouched();
        })
        .catch(err => {
          this.log.er('Could not update user data', err);
        });
    } else {
      this.log.er('Account data and public profile data form untouched');
    }
    if (this.publicProfileForm.valid && !this.publicProfileForm.untouched) {
      this.photographerProfile = this.publicProfileForm.getRawValue();
      this.log.d('Update public profile data', this.photographerProfile);

      this.geolocation
        .getCoordinatesFromAdress(this.photographerProfile.address)
        .then((result: any) => {
          if (result.results[0].geometry.location) {
            this.photographerProfile.location =
              result.results[0].geometry.location;
          }
          this.photographerProfileDoc
            .set(this.photographerProfile)
            .then(() => {
              this.log.d('Updated photographer page data');
              this.publicProfileForm.markAsUntouched();
            })
            .catch(err => {
              this.log.er('Could not update photographer page data', err);
            });
        })
        .catch(err => {
          this.log.er('Error loading adress', err);
        });
    } else {
      this.log.er('No public profile data changed');
    }
  }

  /**
   * Update printing house data
   */
  updatePrintingHouse() {}
}
