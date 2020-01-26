import React from 'react';
import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { Container } from '@material-ui/core';
import EndPointItem from './EndPointItem';

const visibilityFilterFn = visibility => (item) => {
  switch (visibility) {
    case 'ACTIVE':
      return item.active;

    case 'INACTIVE':
      return !item.active;

    default:
      return true;
  }
}

const pathFilterFn = path => (item) => {
  return !path || (item.path && item.path.indexOf(path) > -1);
}

const sorterFn = (field, ascending) => (a, b) => {
  let o1 = a[field], o2 = b[field]

  if (typeof o1 === 'string') {
    return ascending ? o1.localeCompare(o2) : o2.localeCompare(o1);
  }

  return ascending ? o1 - o2 : o2 - o1;
}

const selectEndPoints = state => state.endPoints.endPointsById;
const selectFilters = state => state.filters;
const selectSorter = state => state.sorter;

const selectVisibleEndPoints = createSelector(
  [selectEndPoints, selectFilters, selectSorter],
  (endPointsById, { visibility, path }, { field, ascending }) => {
    return Object.values(endPointsById)
                 .filter(visibilityFilterFn(visibility))
                 .filter(pathFilterFn(path))
                 .sort(sorterFn(field, ascending));
  }
);

export default () => {
  const endPoints = useSelector(selectVisibleEndPoints);

  return (
    <Container id="endPointList" maxWidth="md">
      {endPoints.map(endPoint =>
        <EndPointItem key={endPoint.id} endPoint={endPoint} />
      )}
    </Container>
  );
};