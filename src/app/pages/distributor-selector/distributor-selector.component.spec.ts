import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributorSelectorComponent } from './distributor-selector.component';

describe('DistributorSelectorComponent', () => {
  let component: DistributorSelectorComponent;
  let fixture: ComponentFixture<DistributorSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributorSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributorSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
