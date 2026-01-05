import { Directive, ElementRef, Input, inject, OnInit, OnDestroy, effect } from '@angular/core';
import { EditModeService, PageContent } from '../../core/services/edit-mode.service';
import { LanguageService } from '../../core/services/language.service';

@Directive({
  selector: '[appEditableContent]',
  standalone: true
})
export class EditableContentDirective implements OnInit, OnDestroy {
  @Input() appEditableContent!: string;
  @Input() contentPage!: string;
  @Input() contentSection!: string;
  @Input() contentKey!: string;
  @Input() contentType: string = 'text';

  private el = inject(ElementRef);
  private editMode = inject(EditModeService);
  private lang = inject(LanguageService);

  private content: PageContent | null = null;
  private originalContent: string = '';
  private clickListener?: () => void;

  constructor() {
    effect(() => {
      const isEditMode = this.editMode.isEditMode();
      if (isEditMode) {
        this.enableEdit();
      } else {
        this.disableEdit();
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.originalContent = this.el.nativeElement.textContent || '';

    if (this.contentPage && this.contentSection && this.contentKey) {
      this.content = await this.editMode.getContent(
        this.contentPage,
        this.contentSection,
        this.contentKey
      );

      if (this.content) {
        const currentLang = this.lang.language();
        const contentValue = currentLang === 'fr' ? this.content.content_fr : this.content.content_en;
        if (contentValue) {
          this.el.nativeElement.textContent = contentValue;
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.disableEdit();
  }

  private enableEdit(): void {
    const element = this.el.nativeElement;
    element.contentEditable = 'true';
    element.style.outline = '2px dashed var(--color-accent)';
    element.style.cursor = 'text';
    element.style.padding = '4px';

    this.clickListener = this.onElementClick.bind(this);
    element.addEventListener('blur', this.onBlur.bind(this));
  }

  private disableEdit(): void {
    const element = this.el.nativeElement;
    element.contentEditable = 'false';
    element.style.outline = '';
    element.style.cursor = '';
    element.style.padding = '';

    if (this.clickListener) {
      element.removeEventListener('blur', this.onBlur.bind(this));
    }
  }

  private onElementClick(): void {
    const element = this.el.nativeElement;
    element.focus();
  }

  private async onBlur(): Promise<void> {
    const element = this.el.nativeElement;
    const newContent = element.textContent || '';

    if (newContent === this.originalContent && !this.content) {
      return;
    }

    const currentLang = this.lang.language();

    const contentToSave: PageContent = {
      id: this.content?.id,
      page: this.contentPage,
      section: this.contentSection,
      key: this.contentKey,
      content_fr: currentLang === 'fr' ? newContent : (this.content?.content_fr || ''),
      content_en: currentLang === 'en' ? newContent : (this.content?.content_en || ''),
      content_type: this.contentType,
      is_active: true,
      display_order: this.content?.display_order || 0
    };

    const success = await this.editMode.saveContent(contentToSave);

    if (success) {
      this.originalContent = newContent;
      this.content = contentToSave;
      console.log('Content saved successfully');
    } else {
      element.textContent = this.originalContent;
      alert('Failed to save content');
    }
  }
}
