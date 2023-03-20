const camelize = (s) => {
  return s.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace('-', '').replace('_', '');
  });
};

export function objKeysToCamelCase(value: any): any {
  if (
    !value ||
    value === {} ||
    value === [] ||
    typeof value === 'function' ||
    value instanceof Date
  ) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((valueItem) => objKeysToCamelCase(valueItem));
  }
  if (typeof value === 'object') {
    return Object.keys(value)
      .map((key) => ({ [camelize(key)]: objKeysToCamelCase(value[key]) }))
      .reduce((pre = {}, curr) => ({ ...pre, ...curr }), {});
  }
  return value;
}

export function inCamelCase() {
  return (
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<(...params: any[]) => Promise<any>>,
  ) => {
    const oldFunc = descriptor.value;
    descriptor.value = async function () {
      // eslint-disable-next-line prefer-rest-params
      const result = await oldFunc.apply(this, arguments);
      return objKeysToCamelCase(result);
    };
  };
}

export function camelToSnack(str: string) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function objCamelToSnack(payload: object) {
  return Object.keys(payload).reduce(
    (acc, key) => ({ ...acc, [camelToSnack(key)]: payload[key] }),
    {},
  );
}
