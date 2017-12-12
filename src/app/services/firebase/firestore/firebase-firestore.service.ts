import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from 'angularfire2/firestore';
import { Log } from 'ng2-logger';

import { Event } from '../../../classes/event';
import { User } from '../../../classes/user';
import { Upload } from '../../../classes/upload';
import { PhotographerProfile } from '../../../interfaces/photographer-page';

/**
 * Ein Service für die Kommunikation mit der Firebase Datenbank
 * @author Daniel Sogl
 */
@Injectable()
export class FirebaseFirestoreService {
  private log = Log.create('FirebaseFirestoreService');

  /**
   * @param  {AngularFirestore} afs AngularFire Datenbank
   */
  constructor(private afs: AngularFirestore) {
    this.log.color = 'green';
    this.log.d('Service injected');
  }

  updateUserData(user: any): Promise<void> {
    this.log.d('Update user in firestore', user);
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    if (!user.roles) {
      user = new User(user);
    }
    if (!user.photoURL) {
      user.photoURL =
        'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png';
    }
    if (user.photographerUrl) {
      this.afs
        .doc(`photographerUrls/${user.photographerUrl}`)
        .set({ uid: user.uid });
    }
    return userRef.set(JSON.parse(JSON.stringify(user)));
  }

  getUser(uid: string): AngularFirestoreDocument<User> {
    return this.afs.doc<User>(`users/${uid}`);
  }

  getPhotographerProfile(uid: string) {
    const doc: AngularFirestoreDocument<PhotographerProfile> = this.afs.doc(
      `/photographer/${uid}`
    );
    return doc;
  }

  getPhotographerByUrl(url: string) {
    const shopUrlDoc: AngularFirestoreDocument<any> = this.afs.doc(
      `/photographerUrls/${url}`
    );
    return shopUrlDoc;
  }

  checkDisplayname(photographerUrl: string) {
    photographerUrl = photographerUrl.toLowerCase();
    return this.afs.doc(`photographerUrls/${photographerUrl}`);
  }

  getEvent(uid: string): AngularFirestoreDocument<Event> {
    const eventRef: AngularFirestoreDocument<Event> = this.afs.doc(
      `events/${uid}`
    );
    return eventRef;
  }

  getPhotographerEvents(uid: string): AngularFirestoreCollection<Event[]> {
    const eventRef: AngularFirestoreCollection<Event[]> = this.afs.collection(
      'events',
      ref => ref.where('photographerUid', '==', uid)
    );
    return eventRef;
  }

  getPhotographerEventsFromProfile(uid: string) {
    return this.afs.doc(`users/${uid}`).collection('events');
  }

  setPictureData(upload: Upload) {
    this.afs
      .collection('events')
      .doc(upload.event)
      .collection('originals')
      .add(
        JSON.parse(
          JSON.stringify({
            name: upload.name,
            img: upload.url
          })
        )
      );
  }

  getEventPictures(event: string) {
    return this.afs
      .collection('events')
      .doc(event)
      .collection('public');
  }

  processPayment(token: any, product: any, uid: string) {
    this.log.d('Token', token);
    this.log.d('product', product);
    product.token = token;
    return this.afs
      .collection('users')
      .doc(uid)
      .set(
        {
          subscription: {
            membership: product.name.toLowerCase(),
            token: token.id,
            status: 'processing'
          }
        },
        { merge: true }
      );
  }
}
