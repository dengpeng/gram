import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { loadEnums } from '../enums/enumsSlice';
import EndPointsListContainer from '../endPoints/EndPointsListContainer'
import EndPointEdit from '../endPoints/EndPointEdit'
import FilterSorterBar from '../filters/FilterSorterBar'
import AppBar from './AppBar'

function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(loadEnums());
  }, [ dispatch ]);

  return (
    <div>
      <AppBar />
      <FilterSorterBar />
      <EndPointsListContainer />
      <EndPointEdit />
    </div>
  );
}

export default App;
