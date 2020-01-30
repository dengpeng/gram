import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { loadEnums } from '../enums/enumsSlice';
import EndPointsListContainer from '../endPoints/EndPointsListContainer'
import EndPointEdit from '../endPoints/EndPointEdit'
import FilterSorterBar from '../filters/FilterSorterBar'
import AppBar from './AppBar';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

const theme = createMuiTheme({
  palette: {
    secondary: { main: "rgba(0, 145, 165, 1)" },
    primary: { main: "rgba(0, 84, 110, 1)" },
    error: { main: 'rgba(192, 2, 34, 1)' },
    warning: { main: 'rgba(243, 131, 0, 1)' },
    info: { main: 'rgba(0, 150, 210, 1)' },
    success: { main: 'rgba(190, 203, 0, 1)' },
    text: { primary: 'rgba(52, 64, 70, 1)' }
  },
});

function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(loadEnums());
  }, [ dispatch ]);

  return (
    <ThemeProvider theme={theme}>
      <AppBar />
      <FilterSorterBar />
      <EndPointsListContainer />
      <EndPointEdit />
    </ThemeProvider>
  );
}

export default App;
