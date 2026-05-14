import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontPageComponent } from './front-page.component';

describe('FrontPageComponent', () => {
  let component: FrontPageComponent;
  let fixture: ComponentFixture<FrontPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrontPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FrontPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display scanner section by default', () => {
    expect(component.activeSection).toBe('scanner');
  });

  it('should change active section on navigation', () => {
    component.onNavigationChange('search');
    expect(component.activeSection).toBe('search');
  });
});
