import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelorderReasonComponent } from './cancelorder-reason.component';

describe('CancelorderReasonComponent', () => {
  let component: CancelorderReasonComponent;
  let fixture: ComponentFixture<CancelorderReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelorderReasonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CancelorderReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
