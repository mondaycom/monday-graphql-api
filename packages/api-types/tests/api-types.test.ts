import * as fs from 'fs';

describe('File existence', () => {
  it('should check that generated/api-types.d.ts exists', () => {
    const exists = fs.existsSync('generated/api-types.d.ts');

    expect(exists).toBe(true);
  });
});
