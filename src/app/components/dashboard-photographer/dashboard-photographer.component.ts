import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from 'angularfire2/firestore';
import { Log } from 'ng2-logger';
import { Observable } from 'rxjs/Observable';

import { Event } from '../../classes/event';
import { User } from '../../classes/user';
import { PhotographerProfile } from '../../interfaces/photographer-page';
import { FirebaseAuthService } from '../../services/auth/firebase-auth/firebase-auth.service';
import { FirebaseFirestoreService } from '../../services/firebase/firestore/firebase-firestore.service';

/**
 * User dashboard component
 * @author Daniel Sogl
 */
@Component({
  selector: 'app-dashboard-photographer',
  templateUrl: './dashboard-photographer.component.html',
  styleUrls: ['./dashboard-photographer.component.scss']
})
export class DashboardPhotographerComponent implements OnInit {
  private log = Log.create('DashboardPhotographerComponent');

  public user: User;
  public canCreateEvent: boolean;

  public eventEdit: Event;
  public newEvent: Event = new Event('');

  public eventDocs: AngularFirestoreCollection<Event[]>;
  public events: Observable<Event[]>;
  public photographerProfileDoc: AngularFirestoreDocument<PhotographerProfile>;
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
    website: ''
  };
  public subPlan: any;

  @ViewChild('createEventModal') public createEventModal;

  constructor(
    private auth: FirebaseAuthService,
    private afs: FirebaseFirestoreService,
    private router: Router
  ) {}

  ngOnInit() {
    this.log.color = 'orange';
    this.log.d('Component initialized');

    this.auth.user.subscribe(user => {
      this.user = user;
      this.log.d('Loaded user', user);

      if (this.user.eventsLeft > 0) {
        this.canCreateEvent = true;
      } else {
        this.canCreateEvent = false;
      }

      this.photographerProfileDoc = this.afs.getPhotographerProfile(
        this.user.uid
      );

      this.photographerProfileDoc.valueChanges().subscribe(profile => {
        if (profile) {
          this.photographerProfile = profile;
          this.log.d('Photographer Profile', profile);
        }
      });

      this.eventDocs = this.afs.getPhotographerEvents(this.user.uid);
      this.events = this.eventDocs.snapshotChanges().map((events: any) => {
        return events.map(event => {
          const data = event.payload.doc.data() as Event;
          const id = event.payload.doc.id;
          return { id, ...data };
        });
      });
    });
  }

  createNewEvent() {
    if (this.canCreateEvent) {
      this.newEvent.photographerUid = this.user.uid;
      this.newEvent.public = false;
      this.eventDocs
        .add(JSON.parse(JSON.stringify(this.newEvent)))
        .then(() => {
          this.log.d('Added new event to firestore');
        })
        .catch(err => {
          this.log.er('Could not save event to firestore', err);
        });
    } else {
      this.log.d('User can not create another event without upgrading');
    }
  }

  editEvent(event: Event) {
    this.router.navigate(['event', event.id]);
  }

  updateProfile() {
    this.afs
      .updateUserData(this.user)
      .then(() => {
        this.log.d('Updated user');
      })
      .catch(err => {
        this.log.er('Could not update user data', err);
      });
    this.photographerProfile.photoURL = this.user.photoURL;
    this.photographerProfile.uid = this.user.uid;
    this.photographerProfile.name = `${this.user.name} ${this.user.lastname}`;
    this.photographerProfileDoc
      .set(this.photographerProfile)
      .then(() => {
        this.log.d('Updated photographer page data');
      })
      .catch(err => {
        this.log.er('Could not update photographer page data', err);
      });
  }

  upgradeSubscription(membership: string) {
    if (membership === 'basic') {
      this.subPlan = {
        email: this.user.email,
        name: 'BASIC',
        description: 'Legen Sie bis zu 15 Events an',
        amount: 2500,
        currency: 'eur'
      };
    } else if (membership === 'smart') {
      this.subPlan = {
        email: this.user.email,
        name: 'SMART',
        description: 'Legen Sie bis zu 35 Events an',
        amount: 3500,
        currency: 'eur'
      };
    } else {
      this.subPlan = {
        email: this.user.email,
        name: 'PRO',
        description: 'Legen Sie bis zu 50 Events an',
        amount: 5000,
        currency: 'eur'
      };
    }
  }
}
