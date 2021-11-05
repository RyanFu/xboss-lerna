import { useToggle } from '../index';

describe('xboss-hooks', () => {
  it('needs tests', () => {
    const [state, toggle] = useToggle(false);
    expect(state.value).toBe(false);
    toggle();
    expect(state.value).toBe(true);
  });
});
