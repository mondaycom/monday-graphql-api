import { ColumnValues } from '../../lib/helpers/column-values';

describe('ColumnValues', () => {
  describe('status', () => {
    it('should format status by label', () => {
      expect(ColumnValues.status('Done')).toBe('{"label":"Done"}');
    });
  });

  describe('statusByIndex', () => {
    it('should format status by index', () => {
      expect(ColumnValues.statusByIndex(1)).toBe('{"index":1}');
    });
  });

  describe('text', () => {
    it('should format text value', () => {
      expect(ColumnValues.text('Hello')).toBe('"Hello"');
    });
  });

  describe('number', () => {
    it('should format number value', () => {
      expect(ColumnValues.number(42)).toBe('42');
    });
  });

  describe('date', () => {
    it('should format date without time', () => {
      expect(ColumnValues.date('2024-06-15')).toBe('{"date":"2024-06-15"}');
    });

    it('should format date with time', () => {
      expect(ColumnValues.date('2024-06-15', '14:30:00')).toBe('{"date":"2024-06-15","time":"14:30:00"}');
    });
  });

  describe('people', () => {
    it('should format people with person IDs', () => {
      const result = JSON.parse(ColumnValues.people([123, 456]));
      expect(result.personsAndTeams).toEqual([
        { id: 123, kind: 'person' },
        { id: 456, kind: 'person' },
      ]);
    });

    it('should format people with person and team IDs', () => {
      const result = JSON.parse(ColumnValues.people([123], [789]));
      expect(result.personsAndTeams).toEqual([
        { id: 123, kind: 'person' },
        { id: 789, kind: 'team' },
      ]);
    });
  });

  describe('dropdown', () => {
    it('should format dropdown by labels', () => {
      expect(ColumnValues.dropdown(['A', 'B'])).toBe('{"labels":["A","B"]}');
    });
  });

  describe('dropdownByIds', () => {
    it('should format dropdown by IDs', () => {
      expect(ColumnValues.dropdownByIds([1, 2])).toBe('{"ids":[1,2]}');
    });
  });

  describe('timeline', () => {
    it('should format timeline with from/to', () => {
      expect(ColumnValues.timeline('2024-01-01', '2024-01-31')).toBe('{"from":"2024-01-01","to":"2024-01-31"}');
    });
  });

  describe('checkbox', () => {
    it('should format checked checkbox', () => {
      expect(ColumnValues.checkbox(true)).toBe('{"checked":"true"}');
    });

    it('should format unchecked checkbox', () => {
      expect(ColumnValues.checkbox(false)).toBe('{"checked":"false"}');
    });
  });

  describe('email', () => {
    it('should format email with default text', () => {
      const result = JSON.parse(ColumnValues.email('test@example.com'));
      expect(result).toEqual({ email: 'test@example.com', text: 'test@example.com' });
    });

    it('should format email with custom text', () => {
      const result = JSON.parse(ColumnValues.email('test@example.com', 'Contact'));
      expect(result).toEqual({ email: 'test@example.com', text: 'Contact' });
    });
  });

  describe('phone', () => {
    it('should format phone value', () => {
      expect(ColumnValues.phone('+1234567890', 'US')).toBe('{"phone":"+1234567890","countryShortName":"US"}');
    });
  });

  describe('link', () => {
    it('should format link with default text', () => {
      const result = JSON.parse(ColumnValues.link('https://example.com'));
      expect(result).toEqual({ url: 'https://example.com', text: 'https://example.com' });
    });

    it('should format link with custom text', () => {
      const result = JSON.parse(ColumnValues.link('https://example.com', 'Click'));
      expect(result).toEqual({ url: 'https://example.com', text: 'Click' });
    });
  });

  describe('longText', () => {
    it('should format long text', () => {
      expect(ColumnValues.longText('Multi\nline')).toBe('{"text":"Multi\\nline"}');
    });
  });

  describe('hour', () => {
    it('should format hour with default minute', () => {
      expect(ColumnValues.hour(14)).toBe('{"hour":14,"minute":0}');
    });

    it('should format hour with minute', () => {
      expect(ColumnValues.hour(14, 30)).toBe('{"hour":14,"minute":30}');
    });
  });

  describe('location', () => {
    it('should format location without address', () => {
      expect(ColumnValues.location(40.7, -74.0)).toBe('{"lat":40.7,"lng":-74}');
    });

    it('should format location with address', () => {
      const result = JSON.parse(ColumnValues.location(40.7, -74.0, 'NYC'));
      expect(result).toEqual({ lat: 40.7, lng: -74, address: 'NYC' });
    });
  });

  describe('country', () => {
    it('should format country value', () => {
      expect(ColumnValues.country('US', 'United States')).toBe('{"countryCode":"US","countryName":"United States"}');
    });
  });

  describe('tags', () => {
    it('should format tag IDs', () => {
      expect(ColumnValues.tags([123, 456])).toBe('{"tag_ids":[123,456]}');
    });
  });

  describe('week', () => {
    it('should format week value', () => {
      expect(ColumnValues.week('2024-06-10', '2024-06-16')).toBe('{"week":{"startDate":"2024-06-10","endDate":"2024-06-16"}}');
    });
  });

  describe('boardRelation', () => {
    it('should format board relation IDs', () => {
      expect(ColumnValues.boardRelation([111, 222])).toBe('{"item_ids":[111,222]}');
    });
  });

  describe('rating', () => {
    it('should format rating value', () => {
      expect(ColumnValues.rating(4)).toBe('{"rating":4}');
    });
  });

  describe('clear', () => {
    it('should return null JSON', () => {
      expect(ColumnValues.clear()).toBe('null');
    });
  });
});
