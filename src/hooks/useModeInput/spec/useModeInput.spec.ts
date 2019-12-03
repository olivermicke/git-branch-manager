import { renderHook } from '@testing-library/react-hooks';

import { useModeInput } from '../useModeInput';

jest.mock('ink');

describe('useModeInput', () => {
  it('has correct initial state', () => {
    const { result } = renderHook(() => useModeInput());
    expect(result.current).toEqual(['normal', ' ']);
  });
});
