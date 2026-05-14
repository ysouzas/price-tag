import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'price-tag';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.initThemeDetection();
    this.initLanguageDetection();
  }

  private initLanguageDetection() {
    this.translate.addLangs(['en', 'pt']);
    this.translate.setDefaultLang('en');

    if (typeof window !== 'undefined' && window.navigator) {
      const browserLang = window.navigator.language || (window.navigator as any).userLanguage;
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
