import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSearchComponent } from './product-search.component';

describe('ProductSearchComponent', () => {
  let component: ProductSearchComponent;
  let fixture: ComponentFixture<ProductSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should debounce search input', (done) => {
    component.searchControl.setValue('test');

    setTimeout(() => {
      expect(component.isSearching).toBeFalsy();
      done();
    }, 400);
  });

  it('should display products on search', (done) => {
    component.searchControl.setValue('milk');

    setTimeout(() => {
      expect(component.searchResults.length).toBeGreaterThan(0);
      done();
    }, 400);
  });
});
