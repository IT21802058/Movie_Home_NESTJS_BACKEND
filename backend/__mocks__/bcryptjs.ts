// __mocks__/bcryptjs.ts
export const hash = jest.fn();
export const compare = jest.fn();

export default {
    hash,
    compare,
};