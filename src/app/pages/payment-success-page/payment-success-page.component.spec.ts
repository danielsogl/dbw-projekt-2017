import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSuccessPageComponent } from './payment-success-page.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { FakeLoader } from '../../../../jest-mocks/fake-loader';

describe('PaymentSuccessPageComponent', () => {
  let component: PaymentSuccessPageComponent;
  let fixture: ComponentFixture<PaymentSuccessPageComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useClass: FakeLoader }
          })
        ],
        declarations: [PaymentSuccessPageComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSuccessPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
