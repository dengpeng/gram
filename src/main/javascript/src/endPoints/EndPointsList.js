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

const selectEndPoints = state => state.endPoints.endPointsById;
const selectFilters = state => state.filters;
const selectVisibleEndPoints = createSelector(
  [selectEndPoints, selectFilters],
  (endPointsById, { visibility, path }) => {
    return Object.values(endPointsById).filter(visibilityFilterFn(visibility)).filter(pathFilterFn(path));
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