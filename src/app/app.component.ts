import {
  animate,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';

import { Component, DOCUMENT, Inject, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { BackButtonComponent } from '@components/back-button/back-button.component';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';

const slideInAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          opacity: 0,
        }),
      ],
      { optional: true },
    ),
    query(':enter', [style({ opacity: 0, transform: 'translateY(10px)' })], {
      optional: true,
    }),
    group([
      query(
        ':leave',
        [
          animate(
            '200ms ease-out',
            style({ opacity: 0, transform: 'translateY(-10px)' }),
          ),
        ],
        { optional: true },
      ),
      query(
        ':enter',
        [
          animate(
            '300ms 100ms ease-out',
            style({ opacity: 1, transform: 'translateY(0)' }),
          ),
        ],
        { optional: true },
      ),
    ]),
  ]),
]);

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BackButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [slideInAnimation],
})
export class AppComponent implements OnInit {
  title = 'price-tag';
  showBackButton = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private translate: TranslateService,
    private router: Router,
  ) {}

  prepareRoute(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation']
    );
  }

  ngOnInit() {
    this.initThemeDetection();
    this.initLanguageDetection();
    this.initBackButtonVisibility();
  }

  private initBackButtonVisibility() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        // Show back button on all pages except the root front page
        this.showBackButton = e.url !== '/' && e.url !== '';
      });
  }

  private initLanguageDetection() {
    this.translate.addLangs(['en', 'pt']);
    this.translate.setDefaultLang('en');

    if (typeof window !== 'undefined' && window.navigator) {
      const browserLang =
        window.navigator.language || (window.navigator as any).userLanguage;
      const langCode = browserLang.split('-')[0].toLowerCase();
      const useLang = langCode.match(/en|pt/) ? langCode : 'en';
      this.translate.use(useLang);
    }
  }

  private initThemeDetection() {
    // Only run in browser
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.applyTheme(mediaQuery.matches);

      mediaQuery.addEventListener('change', (e) => {
        this.applyTheme(e.matches);
      });
    }
  }

  private applyTheme(isDark: boolean) {
    if (isDark) {
      this.renderer.removeClass(this.document.body, 'theme-light');
      this.renderer.addClass(this.document.body, 'theme-dark');
    } else {
      this.renderer.removeClass(this.document.body, 'theme-dark');
      this.renderer.addClass(this.document.body, 'theme-light');
    }
  }
}
