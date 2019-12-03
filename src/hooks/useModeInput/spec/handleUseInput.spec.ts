import { Key } from 'ink';

import { handleUseInput } from '../handleUseInput';

jest.mock('ink');

let processExitSpy: jest.SpyInstance<never, [number?]>;

const defaultParams: Parameters<typeof handleUseInput>[0] = {
  key: {} as Key,
  keyboardInput: '',
  input: ' ',
  setInput: jest.fn(),
  mode: 'normal',
  setMode: jest.fn(),
};

describe('handleUseInput', () => {
  beforeAll(() => {
    // @ts-ignore
    processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
  });

  afterAll(() => {
    processExitSpy.mockRestore();
  });

  it('handles uppercase characters', () => {
    handleUseInput({ ...defaultParams, keyboardInput: 'Q' });
    expect(process.exit).toHaveBeenCalledWith(0);
  });

  it('ignores invalid key characters', () => {
    const setInputMock = jest.fn();

    handleUseInput({ ...defaultParams, keyboardInput: 'B', setInput: setInputMock });
    handleUseInput({ ...defaultParams, keyboardInput: 'a', setInput: setInputMock });
    handleUseInput({ ...defaultParams, keyboardInput: 'r', setInput: setInputMock });
    expect(setInputMock).not.toBeCalled();
  });

  it('sets mode state to "normal" on "n" key press', () => {
    const setInputMock = jest.fn();
    const setModeMock = jest.fn();

    handleUseInput({
      ...defaultParams,
      keyboardInput: 'n',
      mode: 'normal',
      setInput: setInputMock,
      setMode: setModeMock,
    });
    expect(setModeMock).toBeCalledWith('normal');
    expect(setInputMock).toBeCalledWith(' ');

    handleUseInput({ ...defaultParams, keyboardInput: 'n', mode: 'checkout', setMode: setModeMock });
    expect(setModeMock).toBeCalledWith('normal');
    expect(setInputMock).toBeCalledWith(' ');
  });

  describe('deletes last input character', () => {
    it('when "backspace" is pressed', () => {
      const setInputMock = jest.fn();

      handleUseInput({
        ...defaultParams,
        keyboardInput: String.fromCharCode(127),
        input: 'foo',
        setInput: setInputMock,
      });
      expect(setInputMock).toBeCalledWith('fo');
    });
  });

  describe('exits the app', () => {
    it('when "q" is pressed', () => {
      handleUseInput({ ...defaultParams, keyboardInput: 'q' });
      expect(process.exit).toHaveBeenCalledWith(0);
    });

    it('when "escape" is pressed', () => {
      handleUseInput({ ...defaultParams, key: { escape: true } as Key });
      expect(process.exit).toHaveBeenCalledWith(0);
    });
  });

  describe('toggles mode state', () => {
    it('for "checkout" mode', () => {
      const setInputMock = jest.fn();
      const setModeMock = jest.fn();

      handleUseInput({
        ...defaultParams,
        keyboardInput: 'c',
        mode: 'normal',
        setInput: setInputMock,
        setMode: setModeMock,
      });
      expect(setModeMock).toBeCalledWith('checkout');

      handleUseInput({
        ...defaultParams,
        keyboardInput: 'c',
        mode: 'checkout',
        setInput: setInputMock,
        setMode: setModeMock,
      });
      expect(setModeMock).toBeCalledWith('normal');
      expect(setInputMock).toBeCalledWith(' ');
    });

    it('for "delete" mode', () => {
      const setInputMock = jest.fn();
      const setModeMock = jest.fn();

      handleUseInput({
        ...defaultParams,
        keyboardInput: 'd',
        mode: 'normal',
        setInput: setInputMock,
        setMode: setModeMock,
      });
      expect(setModeMock).toBeCalledWith('delete');

      handleUseInput({
        ...defaultParams,
        keyboardInput: 'd',
        mode: 'delete',
        setInput: setInputMock,
        setMode: setModeMock,
      });
      expect(setModeMock).toBeCalledWith('normal');
      expect(setInputMock).toBeCalledWith(' ');
    });
  });
});
