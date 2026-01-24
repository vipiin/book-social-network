import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcivateAccount } from './acivate-account';

describe('AcivateAccount', () => {
  let component: AcivateAccount;
  let fixture: ComponentFixture<AcivateAccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcivateAccount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcivateAccount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
