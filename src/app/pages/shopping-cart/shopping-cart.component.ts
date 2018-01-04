import { Component, OnInit } from '@angular/core';
import { Log } from 'ng2-logger';

/**
 * Shopping cart page component
 * @author Daniel Sogl, Tim Kriesler
 */
@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {
  private log = Log.create('ShoppingCartComponent');

  constructor() {}

  ngOnInit() {
    this.log.color = 'orange';
    this.log.d('Component initialized');
  }
}
