import { formatDate } from "../utils/formatDate";

test('Format date to yyyy-mm-dd', () => {
    const result = formatDate('05/04/2025');
    expect(result).toBe('2025-05-04');
});