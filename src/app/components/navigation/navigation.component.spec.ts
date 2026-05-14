import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationComponent } from './navigation.component';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have navigation items', () => {
    expect(component.navItems.length).toBeGreaterThan(0);
  });

  it('should emit navigation change event', (done) => {
    component.navigationChange.subscribe((section) => {
      expect(section).toBe('search');
      done();
    });

    component.onNavItemClick(component.navItems[1]);
  });

  it('should mark active section', () => {
    component.activeSection = 'scanner';
    expect(component.isActive(component.navItems[0])).toBeTruthy();
    expect(component.isActive(component.navItems[1])).toBeFalsy();
  });
});
