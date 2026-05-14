import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupermarketSearchComponent } from './supermarket-search.component';

describe('SupermarketSearchComponent', () => {
  let component: SupermarketSearchComponent;
  let fixture: ComponentFixture<SupermarketSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupermarketSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupermarketSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
