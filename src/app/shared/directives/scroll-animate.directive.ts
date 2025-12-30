import { Directive, ElementRef, Input, OnInit, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appScrollAnimate]',
  standalone: true
})
export class ScrollAnimateDirective implements OnInit, OnDestroy {
  @Input() animationType: 'fade-up' | 'fade-in' | 'fade-left' | 'fade-right' | 'scale' = 'fade-up';
  @Input() animationDelay = 0;
  @Input() animationThreshold = 0.1;

  private observer: IntersectionObserver | null = null;
  private el = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const element = this.el.nativeElement as HTMLElement;
    element.classList.add('scroll-animate', `animate-${this.animationType}`);
    element.style.transitionDelay = `${this.animationDelay}ms`;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            element.classList.add('is-visible');
            this.observer?.unobserve(element);
          }
        });
      },
      { threshold: this.animationThreshold, rootMargin: '0px 0px -50px 0px' }
    );

    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
