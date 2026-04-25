import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

declare const cloudinary: any;

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  resource_type: string;
  bytes: number;
  original_filename: string;
  width?: number;
  height?: number;
}

export type CloudinaryResourceType = 'image' | 'raw' | 'auto';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {

  openUploadWidget(options: {
    folder?: string;
    resourceType?: CloudinaryResourceType;
    maxFiles?: number;
    maxFileSize?: number;
    sources?: string[];
    acceptedFiles?: string;
  } = {}): Promise<CloudinaryUploadResult[]> {
    return new Promise((resolve, reject) => {
      if (typeof cloudinary === 'undefined') {
        reject(new Error('Cloudinary widget not loaded'));
        return;
      }

      const results: CloudinaryUploadResult[] = [];

      const widget = cloudinary.createUploadWidget(
        {
          cloudName: environment.cloudinaryCloudName,
          uploadPreset: environment.cloudinaryUploadPreset,
          folder: options.folder || 'nio-far',
          resourceType: options.resourceType || 'auto',
          maxFiles: options.maxFiles || 1,
          maxFileSize: options.maxFileSize || 10485760,
          sources: options.sources || ['local', 'url', 'camera'],
          clientAllowedFormats: options.acceptedFiles
            ? options.acceptedFiles.split(',').map(f => f.trim().replace('.', ''))
            : undefined,
          multiple: (options.maxFiles || 1) > 1,
          showPoweredBy: false,
          styles: {
            palette: {
              window: '#FFFFFF',
              windowBorder: '#3D2B1F',
              tabIcon: '#C4682B',
              menuIcons: '#6B5B4F',
              textDark: '#3D2B1F',
              textLight: '#8B7B6F',
              link: '#2B8A8A',
              action: '#C4682B',
              inactiveTabIcon: '#8B7B6F',
              error: '#C45B4A',
              inProgress: '#2B8A8A',
              complete: '#2d9b5a',
              sourceBg: '#F5EFE6'
            }
          }
        },
        (error: any, result: any) => {
          if (error) {
            reject(error);
            return;
          }
          if (result.event === 'success') {
            results.push({
              secure_url: result.info.secure_url,
              public_id: result.info.public_id,
              format: result.info.format,
              resource_type: result.info.resource_type,
              bytes: result.info.bytes,
              original_filename: result.info.original_filename,
              width: result.info.width,
              height: result.info.height
            });
          }
          if (result.event === 'close') {
            resolve(results);
          }
        }
      );

      widget.open();
    });
  }
}
