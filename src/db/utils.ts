import snakeCase from 'lodash/snakeCase';

export const onUpdateTrigger = (table) => `
    CREATE TRIGGER ${table}_updated_at
    BEFORE UPDATE ON ${table}
    FOR EACH ROW
    EXECUTE PROCEDURE on_update_timestamp();
  `;

export const camelCaseToSnakeCase = (data: Record<string, any>) => {
  return Object.keys(data).reduce((acc, key) => {
    if (typeof data[key] === 'object') {
      acc[snakeCase(key)] = camelCaseToSnakeCase(data[key]);
    } else {
      acc[snakeCase(key)] = data[key];
    }
    return acc;
  }, {});
};
