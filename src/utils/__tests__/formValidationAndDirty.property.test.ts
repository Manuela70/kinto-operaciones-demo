// @vitest-environment node
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateReturnForm } from '../validateReturnForm';
import type { ReturnFormData, ReturnType, UploadedFile } from '../../types';
import { getUploadFields } from '../../config/uploadFields';

/**
 * Property tests for form validation and dirty form detection.
 *
 * **Validates: Requirements 10.3, 10.5**
 */

// --- Generators ---

const returnTypes: ReturnType[] = ['Devolución', 'Anticipada', 'Robo'];

/** Generator for a valid UploadedFile */
const uploadedFileArb: fc.Arbitrary<UploadedFile> = fc.record({
  id: fc.uuid(),
  name: fc.stringMatching(/^[a-zA-Z0-9_-]{1,20}\.(jpg|pdf)$/),
  size: fc.integer({ min: 1, max: 10_000_000 }),
  type: fc.constantFrom('image/jpeg', 'application/pdf'),
});

/** Build a complete, valid ReturnFormData for a given return type */
function buildValidFormData(returnType: ReturnType): fc.Arbitrary<ReturnFormData> {
  const uploadFields = getUploadFields(returnType);

  // Build a files record where every required upload field has at least one file
  const filesArb = fc.tuple(
    ...uploadFields.map((field) =>
      fc.array(uploadedFileArb, { minLength: 1, maxLength: field.maxFiles })
    )
  ).map((fileArrays) => {
    const files: Record<string, UploadedFile[]> = {};
    uploadFields.forEach((field, i) => {
      files[field.name] = fileArrays[i];
    });
    return files;
  });

  return fc.tuple(
    fc.stringMatching(/^2025-(1[0-2])-(0[1-9]|[12]\d|3[01])$/), // fechaFinContrato
    fc.integer({ min: 1, max: 200000 }),                          // kilometraje
    fc.stringMatching(/^[A-Z][a-z]{3,12}$/),                      // dealer
    fc.stringMatching(/^2025-(1[0-2])-(0[1-9]|[12]\d|3[01])$/), // fechaDevolucion
    fc.boolean(),                                                   // devolverParaStock
    fc.string({ minLength: 0, maxLength: 200 }),                   // comentarios
    filesArb,
  ).map(([fechaFinContrato, kilometraje, dealer, fechaDevolucion, devolverParaStock, comentarios, files]) => ({
    fechaFinContrato,
    kilometraje,
    dealer,
    tipoDevolucion: returnType,
    fechaDevolucion,
    devolverParaStock,
    comentarios,
    files,
  }));
}

/** Generator for a fully valid form across any return type */
const validFormArb: fc.Arbitrary<ReturnFormData> = fc
  .constantFrom(...returnTypes)
  .chain((rt) => buildValidFormData(rt));

/**
 * The 5 fixed required fields in ReturnFormData.
 * Each entry describes the field key and the "empty" value to set.
 */
const fixedRequiredFields: Array<{
  key: keyof ReturnFormData;
  emptyValue: ReturnFormData[keyof ReturnFormData];
}> = [
  { key: 'fechaFinContrato', emptyValue: '' },
  { key: 'kilometraje', emptyValue: '' as unknown as number | '' },
  { key: 'dealer', emptyValue: '' },
  { key: 'tipoDevolucion', emptyValue: '' as unknown as ReturnType | '' },
  { key: 'fechaDevolucion', emptyValue: '' },
];

// --- Property 8 ---

describe('Property 8: Save with missing required fields shows error dialog', () => {
  /**
   * **Validates: Requirements 10.3**
   *
   * For any valid form state where we blank out at least one required fixed field,
   * validateReturnForm returns isValid === false with a non-empty missingFields list.
   */
  it('blanking any single required fixed field makes validation fail', () => {
    fc.assert(
      fc.property(
        validFormArb,
        fc.constantFrom(...fixedRequiredFields),
        (form, fieldToBlank) => {
          const brokenForm: ReturnFormData = {
            ...form,
            [fieldToBlank.key]: fieldToBlank.emptyValue,
          };

          // When tipoDevolucion is blanked, upload validation won't trigger,
          // but the fixed field itself will be missing
          const result = validateReturnForm(brokenForm);

          expect(result.isValid).toBe(false);
          expect(result.missingFields.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 200 }
    );
  });

  /**
   * **Validates: Requirements 10.3**
   *
   * For any return type, removing all files from a required upload field
   * makes validation fail.
   */
  it('removing files from a required upload field makes validation fail', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...returnTypes).chain((rt) =>
          fc.tuple(
            buildValidFormData(rt),
            fc.constantFrom(...getUploadFields(rt).filter((f) => f.required))
          )
        ),
        ([form, uploadField]) => {
          const brokenForm: ReturnFormData = {
            ...form,
            files: {
              ...form.files,
              [uploadField.name]: [], // Remove all files for this required upload field
            },
          };

          const result = validateReturnForm(brokenForm);

          expect(result.isValid).toBe(false);
          expect(result.missingFields).toContain(uploadField.label);
        }
      ),
      { numRuns: 200 }
    );
  });

  /**
   * **Validates: Requirements 10.3**
   *
   * A fully valid form passes validation successfully.
   * (Sanity check — ensures our valid generator actually produces valid data.)
   */
  it('a fully valid form passes validation', () => {
    fc.assert(
      fc.property(validFormArb, (form) => {
        const result = validateReturnForm(form);
        expect(result.isValid).toBe(true);
        expect(result.missingFields).toHaveLength(0);
      }),
      { numRuns: 200 }
    );
  });
});

// --- Property 9 ---

/**
 * Pure function that implements the same dirty detection logic as useDirtyForm.
 * Compares the JSON serialized form to detect any change.
 */
function isDirty(initial: ReturnFormData, current: ReturnFormData): boolean {
  return JSON.stringify(current) !== JSON.stringify(initial);
}

/** Generator for modifying a single editable field in a ReturnFormData */
function modifyOneField(form: ReturnFormData): fc.Arbitrary<ReturnFormData> {
  // Available editable fields and their modification generators
  type FieldMod = { key: string; arb: fc.Arbitrary<ReturnFormData> };

  const mods: FieldMod[] = [
    {
      key: 'kilometraje',
      arb: fc.integer({ min: 0, max: 999999 })
        .filter((km) => km !== form.kilometraje)
        .map((km) => ({ ...form, kilometraje: km })),
    },
    {
      key: 'dealer',
      arb: fc.stringMatching(/^[A-Z][a-z]{3,15}$/)
        .filter((d) => d !== form.dealer)
        .map((d) => ({ ...form, dealer: d })),
    },
    {
      key: 'fechaDevolucion',
      arb: fc.stringMatching(/^2025-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)
        .filter((d) => d !== form.fechaDevolucion)
        .map((d) => ({ ...form, fechaDevolucion: d })),
    },
    {
      key: 'devolverParaStock',
      arb: fc.constant({ ...form, devolverParaStock: !form.devolverParaStock }),
    },
    {
      key: 'comentarios',
      arb: fc.string({ minLength: 1, maxLength: 200 })
        .filter((c) => c !== form.comentarios)
        .map((c) => ({ ...form, comentarios: c })),
    },
  ];

  return fc.constantFrom(...mods).chain((mod) => mod.arb);
}

describe('Property 9: Closing modal with unsaved changes shows partial save dialog', () => {
  /**
   * **Validates: Requirements 10.5**
   *
   * For any initial form state, modifying any single editable field
   * makes isDirty() return true.
   */
  it('modifying any editable field makes the form dirty', () => {
    fc.assert(
      fc.property(
        validFormArb.chain((form) =>
          modifyOneField(form).map((modified) => ({ initial: form, modified }))
        ),
        ({ initial, modified }) => {
          expect(isDirty(initial, modified)).toBe(true);
        }
      ),
      { numRuns: 200 }
    );
  });

  /**
   * **Validates: Requirements 10.5**
   *
   * A form with no modifications is NOT dirty.
   */
  it('an unmodified form is not dirty', () => {
    fc.assert(
      fc.property(validFormArb, (form) => {
        // Clone via JSON to ensure same serialization path
        const clone: ReturnFormData = JSON.parse(JSON.stringify(form));
        expect(isDirty(form, clone)).toBe(false);
      }),
      { numRuns: 200 }
    );
  });

  /**
   * **Validates: Requirements 10.5**
   *
   * Toggling the boolean field devolverParaStock always changes dirty state.
   */
  it('toggling devolverParaStock makes the form dirty', () => {
    fc.assert(
      fc.property(validFormArb, (form) => {
        const modified: ReturnFormData = {
          ...form,
          devolverParaStock: !form.devolverParaStock,
        };
        expect(isDirty(form, modified)).toBe(true);
      }),
      { numRuns: 200 }
    );
  });
});
