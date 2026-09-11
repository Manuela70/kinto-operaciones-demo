import { describe, it, expect } from 'vitest';
import { isValidFileType, canAddMoreFiles } from './fileValidation';

describe('isValidFileType', () => {
  it('accepts .pdf file when .pdf is required', () => {
    expect(isValidFileType('document.pdf', '.pdf')).toBe(true);
  });

  it('accepts .jpg file when .jpg is required', () => {
    expect(isValidFileType('photo.jpg', '.jpg')).toBe(true);
  });

  it('rejects .jpg file when .pdf is required', () => {
    expect(isValidFileType('photo.jpg', '.pdf')).toBe(false);
  });

  it('rejects .pdf file when .jpg is required', () => {
    expect(isValidFileType('document.pdf', '.jpg')).toBe(false);
  });

  it('rejects .png file for both .pdf and .jpg', () => {
    expect(isValidFileType('image.png', '.pdf')).toBe(false);
    expect(isValidFileType('image.png', '.jpg')).toBe(false);
  });

  it('handles case-insensitive extensions', () => {
    expect(isValidFileType('document.PDF', '.pdf')).toBe(true);
    expect(isValidFileType('photo.JPG', '.jpg')).toBe(true);
  });

  it('rejects files with no extension', () => {
    expect(isValidFileType('noextension', '.pdf')).toBe(false);
  });

  it('handles files with multiple dots', () => {
    expect(isValidFileType('my.file.name.pdf', '.pdf')).toBe(true);
    expect(isValidFileType('my.file.name.jpg', '.jpg')).toBe(true);
  });
});

describe('canAddMoreFiles', () => {
  it('returns true when currentCount is less than maxFiles', () => {
    expect(canAddMoreFiles(0, 5)).toBe(true);
    expect(canAddMoreFiles(4, 5)).toBe(true);
  });

  it('returns false when currentCount equals maxFiles', () => {
    expect(canAddMoreFiles(5, 5)).toBe(false);
    expect(canAddMoreFiles(1, 1)).toBe(false);
  });

  it('returns false when currentCount exceeds maxFiles', () => {
    expect(canAddMoreFiles(6, 5)).toBe(false);
  });

  it('returns false when maxFiles is 0', () => {
    expect(canAddMoreFiles(0, 0)).toBe(false);
  });
});
