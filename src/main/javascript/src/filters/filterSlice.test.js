import filtersReducer, { filterVisibility, filterPath } from './filtersSlice';

describe('filters reducer', () => {
  it('should handles "filterPath" action', () => {
    const state1 = { path: "", visibility: 'ALL' };
    const state2 = { path: "foo", visibility: 'ALL' }
    expect(filtersReducer(state1, filterPath("foo"))).toEqual(state2);
    expect(filtersReducer(state2, filterPath(""))).toEqual(state1);
  });

  it('should handles "filterVisibility" action', () => {
    const state1 = { path: "foo", visibility: 'ALL' };
    const state2 = { path: "foo", visibility: 'ACTIVE' };
    expect(filtersReducer(state1, filterVisibility("ACTIVE"))).toEqual(state2);
    expect(filtersReducer(state2, filterVisibility("ALL"))).toEqual(state1);
  })
  
  it('should handles "filterVisibility" action with invalid payload', () => {
    const state1 = { path: "", visibility: 'ALL' };
    const state2 = { path: "", visibility: 'INACTIVE' };
    expect(filtersReducer(state1, filterVisibility("Active"))).toEqual(state1);
    expect(filtersReducer(state2, filterVisibility("foo"))).toEqual(state2);
  })
  
})

