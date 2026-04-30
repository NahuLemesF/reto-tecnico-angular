import { calculateRevisionDate } from './date.utils';

describe('dateUtils', () => {
  describe('calculateRevisionDate', () => {
    it('debería sumar exactamente un año a la fecha de liberación', () => {
      const releaseDate = '2025-01-01';
      const expectedRevisionDate = '2026-01-01';
      expect(calculateRevisionDate(releaseDate)).toBe(expectedRevisionDate);
    });

    it('debería manejar años bisiestos correctamente', () => {
      const releaseDate = '2024-02-29';
      // Un año después de un 29 de feb no bisiesto suele ser 1 de marzo o 28 feb dependiendo de la lógica
      // JS Date(2024, 1, 29) + 1 year = 2025-03-01 porque 2025 no tiene 29 de feb
      const result = calculateRevisionDate(releaseDate);
      expect(result).toBe('2025-03-01');
    });

    it('debería retornar string vacío si no se provee fecha', () => {
      expect(calculateRevisionDate('')).toBe('');
    });
  });
});
