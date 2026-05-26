/**
 * Column value builders for monday.com API.
 * These helpers produce correctly-formatted JSON strings for use with
 * change_column_value / change_multiple_column_values mutations.
 */

export const ColumnValues = {
  status(label: string): string {
    return JSON.stringify({ label });
  },

  statusByIndex(index: number): string {
    return JSON.stringify({ index });
  },

  text(value: string): string {
    return JSON.stringify(value);
  },

  number(value: number): string {
    return JSON.stringify(value);
  },

  date(date: string, time?: string): string {
    const obj: { date: string; time?: string } = { date };
    if (time) obj.time = time;
    return JSON.stringify(obj);
  },

  people(personIds: number[], teamIds?: number[]): string {
    const personsAndTeams: Array<{ id: number; kind: 'person' | 'team' }> = [];
    for (const id of personIds) {
      personsAndTeams.push({ id, kind: 'person' });
    }
    if (teamIds) {
      for (const id of teamIds) {
        personsAndTeams.push({ id, kind: 'team' });
      }
    }
    return JSON.stringify({ personsAndTeams });
  },

  dropdown(labels: string[]): string {
    return JSON.stringify({ labels });
  },

  dropdownByIds(ids: number[]): string {
    return JSON.stringify({ ids });
  },

  timeline(from: string, to: string): string {
    return JSON.stringify({ from, to });
  },

  checkbox(checked: boolean): string {
    return JSON.stringify({ checked: checked ? 'true' : 'false' });
  },

  rating(value: number): string {
    return JSON.stringify({ rating: value });
  },

  email(email: string, text?: string): string {
    return JSON.stringify({ email, text: text ?? email });
  },

  phone(phone: string, countryShortName: string): string {
    return JSON.stringify({ phone, countryShortName });
  },

  link(url: string, text?: string): string {
    return JSON.stringify({ url, text: text ?? url });
  },

  longText(text: string): string {
    return JSON.stringify({ text });
  },

  hour(hour: number, minute?: number): string {
    return JSON.stringify({ hour, minute: minute ?? 0 });
  },

  location(lat: number, lng: number, address?: string): string {
    const obj: { lat: number; lng: number; address?: string } = { lat, lng };
    if (address) obj.address = address;
    return JSON.stringify(obj);
  },

  country(countryCode: string, countryName: string): string {
    return JSON.stringify({ countryCode, countryName });
  },

  tags(tagIds: number[]): string {
    return JSON.stringify({ tag_ids: tagIds });
  },

  week(startDate: string, endDate: string): string {
    return JSON.stringify({ week: { startDate, endDate } });
  },

  boardRelation(itemIds: number[]): string {
    return JSON.stringify({ item_ids: itemIds });
  },

  clear(): string {
    return JSON.stringify(null);
  },
} as const;
