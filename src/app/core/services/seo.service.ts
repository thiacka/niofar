import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { LanguageService } from './language.service';
import { environment } from '../../../environments/environment';

export interface SeoConfig {
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  image?: string;
  path?: string;
  type?: 'website' | 'article';
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private document = inject(DOCUMENT);
  private router = inject(Router);
  private lang = inject(LanguageService);

  private readonly siteName = 'NIO FAR Tourisme';
  private readonly siteUrl = environment.siteUrl;
  private readonly defaultImage = 'https://media.istockphoto.com/id/2193209869/fr/photo/le-pêcheur-au-bord-du-lac-retba-lac-rose-près-de-dakar-sénégal-afrique-de-louest.jpg?s=1024x1024&w=is&k=20&c=default';

  setPage(config: SeoConfig): void {
    const isFr = this.lang.language() === 'fr';
    const title = isFr ? config.titleFr : config.titleEn;
    const description = isFr ? config.descriptionFr : config.descriptionEn;
    const fullTitle = `${title} | ${this.siteName}`;
    const path = config.path ?? this.router.url;
    const url = `${this.siteUrl}${path}`;
    const image = config.image ?? this.defaultImage;
    const type = config.type ?? 'website';

    // <title>
    this.titleService.setTitle(fullTitle);

    // lang attribute on <html>
    this.document.documentElement.lang = this.lang.language();

    // Standard meta
    this.metaService.updateTag({ name: 'description', content: description });

    // Open Graph
    this.metaService.updateTag({ property: 'og:title', content: fullTitle });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:image', content: image });
    this.metaService.updateTag({ property: 'og:url', content: url });
    this.metaService.updateTag({ property: 'og:type', content: type });
    this.metaService.updateTag({ property: 'og:site_name', content: this.siteName });
    this.metaService.updateTag({ property: 'og:locale', content: isFr ? 'fr_FR' : 'en_US' });

    // Twitter Card
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: fullTitle });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    this.metaService.updateTag({ name: 'twitter:image', content: image });

    // Canonical
    this.setCanonicalUrl(url);
  }

  setJsonLd(data: object, id = 'page-schema'): void {
    let script = this.document.querySelector(`script[data-schema-id="${id}"]`) as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-schema-id', id);
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }

  private setCanonicalUrl(url: string): void {
    let link = this.document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
