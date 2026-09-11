// @vitest-environment node
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { isValidFileType } from '../fileValidation';
import type { UploadedFile } from '../../types';

/**
 * Property tests for file upload validation and file list management.
 *
 * **Validates: Requirements 9.3, 9.4, 9.7**
 */

// ---------------------------------------------------------------------------
// Generators
// ---------------------------------------------------------------------------

/** Common file extensions that are NOT .pdf or .jpg */
const invalidExtensions = [
  '.png', '.gif', '.bmp', '.doc', '.docx', '.xls', '.xlsx',
  '.txt', '.zip', '.rar', '.svg', '.webp', '.mp4', '.csv',
];

/** Generator for a base file name (no extension) */
const baseNameArb = fc.stringOf(
  fc.char().filter((c) => c !== '.' && c !== '/' && c !== '\\' && c !== '\0'),
  { minLength: 1, maxLength: 30 },
).map((s) => s.trim() || 'file');

/** Generator for the two valid accepted extensions */
const acceptedExtensionArb: fc.Arbitrary<'.pdf' | '.jpg'> = fc.constantFrom(
  '.pdf' as const,
  '.jpg' as const,
);

/** Generator for a file name with the correct matching extension */
const matchingFileNameArb = fc.tuple(baseNameArb, acceptedExtensionArb).map(
  ([name, ext]) => ({ fileName: `${name}${ext}`, ext }),
);

/** Generator for a file name whose extension does NOT match the accepted one */
const mismatchedFileNameArb = fc
  .tuple(baseNameArb, acceptedExtensionArb)
  .map(([name, accepted]) => {
    // Pick the *other* valid extension or a completely invalid one
    const wrong = accepted === '.pdf' ? '.jpg' : '.pdf';
    return { fileName: `${name}${wrong}`, accepted };
  });

/** Generator for a file name with an entirely invalid extension */
const invalidExtFileNameArb = fc
  .tuple(baseNameArb, fc.constantFrom(...invalidExtensions), acceptedExtensionArb)
  .map(([name, ext, accepted]) => ({
    fileName: `${name}${ext}`,
    accepted,
  }));

/** Generator for a file name with no extension at all */
const noExtFileNameArb = fc.tuple(baseNameArb, acceptedExtensionArb).map(
  ([name, accepted]) => ({ fileName: name.replace(/\./g, ''), accepted }),
);

// ---------------------------------------------------------------------------
// Generator for UploadedFile lists (Property 7)
// ---------------------------------------------------------------------------

const uploadedFileArb: fc.Arbitrary<UploadedFile> = fc.record({
  id: fc.uuid(),
  name: baseNameArb.map((n) => `${n}.jpg`),
  size: fc.integer({ min: 1, max: 10_000_000 }),
  type: fc.constant('image/jpeg'),
});

/** Generator for a non-empty list of uploaded files with unique IDs */
const uploadedFileListArb: fc.Arbitrary<UploadedFile[]> = fc
  .uniqueArray(uploadedFileArb, {
    minLength: 1,
    maxLength: 10,
    selector: (f) => f.id,
  });

// ---------------------------------------------------------------------------
// Pure helper: delete a file by id from a list (the logic under test)
// ---------------------------------------------------------------------------

/**
 * Simulates the file deletion logic used in the UploadDialog component.
 * Given a list and a target id, returns the list without that file.
 */
function deleteFileById(files: UploadedFile[], id: string): UploadedFile[] {
  return files.filter((f) => f.id !== id);
}

// ---------------------------------------------------------------------------
// Property 6: Upload file type validation rejects invalid extensions
// ---------------------------------------------------------------------------

describe('Property 6: Upload file type validation rejects invalid extensions', () => {
  /**
   * **Validates: Requirements 9.3, 9.4**
   *
   * For any file whose extension matches the accepted extension,
   * isValidFileType returns true.
   */
  it('accepts files with the correct matching extension', () => {
    fc.assert(
      fc.property(matchingFileNameArb, ({ fileName, ext }) => {
        expect(isValidFileType(fileName, ext)).toBe(true);
      }),
      { numRuns: 200 },
    );
  });

  /**
   * **Validates: Requirements 9.3, 9.4**
   *
   * For any file whose extension is the other valid type (e.g. .jpg when .pdf
   * is accepted), isValidFileType returns false.
   */
  it('rejects files with the wrong valid extension', () => {
    fc.assert(
      fc.property(mismatchedFileNameArb, ({ fileName, accepted }) => {
        expect(isValidFileType(fileName, accepted)).toBe(false);
      }),
      { numRuns: 200 },
    );
  });

  /**
   * **Validates: Requirements 9.3, 9.4**
   *
   * For any file whose extension is completely invalid (not .pdf or .jpg),
   * isValidFileType always returns false regardless of which extension is accepted.
   */
  it('rejects files with entirely invalid extensions', () => {
    fc.assert(
      fc.property(invalidExtFileNameArb, ({ fileName, accepted }) => {
        expect(isValidFileType(fileName, accepted)).toBe(false);
      }),
      { numRuns: 200 },
    );
  });

  /**
   * **Validates: Requirements 9.3, 9.4**
   *
   * For any file name without an extension,
   * isValidFileType returns false.
   */
  it('rejects files with no extension', () => {
    fc.assert(
      fc.property(noExtFileNameArb, ({ fileName, accepted }) => {
        expect(isValidFileType(fileName, accepted)).toBe(false);
      }),
      { numRuns: 100 },
    );
  });

  /**
   * **Validates: Requirements 9.3, 9.4**
   *
   * Extension matching is case-insensitive — uppercase extensions should be accepted.
   */
  it('accepts files with uppercase extensions (case-insensitive)', () => {
    fc.assert(
      fc.property(
        fc.tuple(baseNameArb, acceptedExtensionArb),
        ([name, ext]) => {
          const upperFile = `${name}${ext.toUpperCase()}`;
          expect(isValidFileType(upperFile, ext)).toBe(true);
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 7: Deleting a file removes exactly that file
// ---------------------------------------------------------------------------

describe('Property 7: Deleting a file removes exactly that file', () => {
  /**
   * **Validates: Requirements 9.7**
   *
   * For any list of files and any file in that list, deleting that file
   * produces a list with exactly one fewer element.
   */
  it('deletion reduces list length by exactly one', () => {
    fc.assert(
      fc.property(
        uploadedFileListArb.chain((files) =>
          fc.tuple(
            fc.constant(files),
            fc.integer({ min: 0, max: files.length - 1 }),
          ),
        ),
        ([files, idx]) => {
          const target = files[idx];
          const result = deleteFileById(files, target.id);
          expect(result).toHaveLength(files.length - 1);
        },
      ),
      { numRuns: 200 },
    );
  });

  /**
   * **Validates: Requirements 9.7**
   *
   * After deletion, the removed file's id is no longer present in the list.
   */
  it('deleted file is no longer present in the result', () => {
    fc.assert(
      fc.property(
        uploadedFileListArb.chain((files) =>
          fc.tuple(
            fc.constant(files),
            fc.integer({ min: 0, max: files.length - 1 }),
          ),
        ),
        ([files, idx]) => {
          const target = files[idx];
          const result = deleteFileById(files, target.id);
          const resultIds = result.map((f) => f.id);
          expect(resultIds).not.toContain(target.id);
        },
      ),
      { numRuns: 200 },
    );
  });

  /**
   * **Validates: Requirements 9.7**
   *
   * After deletion, every file that was NOT the target remains in the list
   * unchanged (same id, name, size, type).
   */
  it('all other files remain unchanged after deletion', () => {
    fc.assert(
      fc.property(
        uploadedFileListArb.chain((files) =>
          fc.tuple(
            fc.constant(files),
            fc.integer({ min: 0, max: files.length - 1 }),
          ),
        ),
        ([files, idx]) => {
          const target = files[idx];
          const result = deleteFileById(files, target.id);

          const otherFiles = files.filter((f) => f.id !== target.id);
          expect(result).toEqual(otherFiles);
        },
      ),
      { numRuns: 200 },
    );
  });

  /**
   * **Validates: Requirements 9.7**
   *
   * Deleting a file whose id does not exist in the list leaves it unchanged.
   */
  it('deleting a non-existent id leaves the list unchanged', () => {
    fc.assert(
      fc.property(
        fc.tuple(uploadedFileListArb, fc.uuid()),
        ([files, randomId]) => {
          // Only test when randomId is NOT in the list
          fc.pre(!files.some((f) => f.id === randomId));
          const result = deleteFileById(files, randomId);
          expect(result).toEqual(files);
        },
      ),
      { numRuns: 100 },
    );
  });
});
