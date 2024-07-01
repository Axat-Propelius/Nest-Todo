import { Transform } from 'class-transformer';

type StringAction = 'lowerCase' | 'trim';

export function stringSanitize(actions: StringAction[] = []) {
  actions = Array.from(new Set(actions));

  return Transform(({ value }) => {
    actions.map((transform) => {
      switch (transform) {
        case 'lowerCase':
          value = value.toLowerCase();
          break;
        case 'trim':
          value = value.trim();
          break;
      }
    });
    return value;
  });
}
