import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CloudinaryService, CloudinaryResourceType } from '../../../core/services/cloudinary.service';

@Component({
  selector: 'app-cloudinary-upload',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="upload-field">
      <div class="upload-input-row">
        <input
          type="url"
          [value]="value()"
          (input)="onManualInput($event)"
          [placeholder]="placeholder()"
          class="upload-url-input"
        />
        <button type="button" class="upload-btn" (click)="openWidget()" [disabled]="isUploading()">
          @if (isUploading()) {
            <span class="spinner-tiny"></span>
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          }
        </button>
      </div>
      @if (value() && showPreview()) {
        <div class="upload-preview" [class.pdf-preview]="isPdf()">
          @if (isPdf()) {
            <div class="pdf-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <span>PDF</span>
            </div>
          } @else {
            <img [src]="value()" alt="Preview" loading="lazy" />
          }
          <button type="button" class="clear-btn" (click)="clearValue()" title="Supprimer">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .upload-field { display: flex; flex-direction: column; gap: 8px; }

    .upload-input-row { display: flex; gap: 8px; }

    .upload-url-input {
      flex: 1;
      padding: 8px 12px;
      border: 2px solid rgba(61,43,31,0.15);
      border-radius: 8px;
      font-size: 0.95rem;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }
    .upload-url-input:focus { outline: none; border-color: var(--color-primary, #3D2B1F); }

    .upload-btn {
      flex-shrink: 0;
      width: 42px; height: 42px;
      display: flex; align-items: center; justify-content: center;
      border: 2px solid var(--color-primary, #3D2B1F);
      border-radius: 8px;
      background: transparent;
      color: var(--color-primary, #3D2B1F);
      cursor: pointer;
      transition: all 0.2s;
    }
    .upload-btn:hover:not(:disabled) {
      background: var(--color-primary, #3D2B1F);
      color: white;
    }
    .upload-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    .spinner-tiny {
      width: 16px; height: 16px;
      border: 2px solid rgba(61,43,31,0.2);
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .upload-preview {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      height: 120px;
      background: #f5f0ea;
    }
    .upload-preview img {
      width: 100%; height: 100%;
      object-fit: cover;
    }
    .upload-preview.pdf-preview {
      display: flex; align-items: center; justify-content: center;
      background: rgba(196,91,74,0.08);
    }
    .pdf-badge {
      display: flex; flex-direction: column; align-items: center; gap: 4px;
      color: #C45B4A; font-weight: 700; font-size: 0.85rem;
    }

    .clear-btn {
      position: absolute; top: 6px; right: 6px;
      width: 24px; height: 24px;
      display: flex; align-items: center; justify-content: center;
      background: rgba(0,0,0,0.6); color: white;
      border: none; border-radius: 50%;
      cursor: pointer; transition: background 0.2s;
    }
    .clear-btn:hover { background: #C45B4A; }
  `]
})
export class CloudinaryUploadComponent {
  private cloudinary = inject(CloudinaryService);

  value = input<string>('');
  folder = input<string>('nio-far');
  resourceType = input<CloudinaryResourceType>('auto');
  maxFiles = input<number>(1);
  acceptedFiles = input<string>('');
  placeholder = input<string>('https://...');
  showPreview = input<boolean>(true);

  urlChange = output<string>();
  filesUploaded = output<{ url: string; name: string; type: string; size: number }[]>();

  isUploading = signal(false);

  isPdf(): boolean {
    const url = this.value();
    return url.endsWith('.pdf') || url.includes('/raw/') || url.includes('format=pdf');
  }

  onManualInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.urlChange.emit(val);
  }

  clearValue(): void {
    this.urlChange.emit('');
  }

  async openWidget(): Promise<void> {
    this.isUploading.set(true);
    try {
      const results = await this.cloudinary.openUploadWidget({
        folder: this.folder(),
        resourceType: this.resourceType(),
        maxFiles: this.maxFiles(),
        acceptedFiles: this.acceptedFiles() || undefined,
      });

      if (results.length > 0) {
        this.urlChange.emit(results[0].secure_url);

        this.filesUploaded.emit(results.map(r => ({
          url: r.secure_url,
          name: r.original_filename + '.' + r.format,
          type: r.resource_type === 'raw' ? 'application/pdf' : `image/${r.format}`,
          size: r.bytes
        })));
      }
    } catch (err) {
      console.error('Cloudinary upload error:', err);
    } finally {
      this.isUploading.set(false);
    }
  }
}
