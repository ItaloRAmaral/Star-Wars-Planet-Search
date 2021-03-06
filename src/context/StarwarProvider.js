import React, { useState } from 'react';
import PropTypes from 'prop-types';
import StarwarContext from './StarwarContext';

function StarwarProvider(props) {
  const [loading, setLoading] = useState(false);
  const [planets, setGetPlanets] = useState([]);
  const [searchByName, setSearchByName] = useState('');
  const [filtredPlanets, setFiltredPlanets] = useState([]);
  const [filterType, setFilterType] = useState('population');
  const [operatorType, setOperatorFilter] = useState('maior que');
  const [valueType, setValue] = useState(0);
  const [numericFilter, setNumericFilter] = useState([]);
  const [filtersType, setFiltersType] = useState(['population',
    'orbital_period',
    'diameter',
    'rotation_period',
    'surface_water',
  ]);
  /// testando
  const [order, setOrder] = useState({
    column: 'name',
    sort: 'ASC',
  });
  const [columnOrder, setColumnOrder] = useState('population');
  const [typeOrder, setTypeOrder] = useState('ASC');
  const [planetsData, setPlanetsData] = useState({
    unknownData: [],
    planetsOrderedData: [],
  });

  const fetchPlanets = async () => {
    setLoading(true);
    try {
      const url = 'https://swapi-trybe.herokuapp.com/api/planets/';
      const fetchData = await fetch(url);
      const { results } = await fetchData.json();
      setGetPlanets(results);
      setFiltredPlanets(results);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleChange = (name) => {
    setSearchByName(name);
  };

  const handleFilterType = (value) => {
    setFilterType(value);
  };

  const handleOperatorFilter = (value) => {
    setOperatorFilter(value);
  };

  const handleValue = (value) => {
    setValue(value);
  };

  const handleNumericFilter = () => {
    const newNumericFilter = {
      filterType,
      operatorType,
      valueType,
    };

    setNumericFilter([...numericFilter, newNumericFilter]);
  };

  const { children } = props;
  const contextType = {
    loading,
    fetchPlanets,
    planets,
    handleChange,
    searchByName,
    setGetPlanets,
    filtredPlanets,
    setFiltredPlanets,
    handleFilterType,
    handleOperatorFilter,
    handleValue,
    handleNumericFilter,
    numericFilter,
    filterType,
    operatorType,
    valueType,
    filtersType,
    setFiltersType,
    setNumericFilter,
    /// testando
    order,
    setOrder,
    setColumnOrder,
    columnOrder,
    setTypeOrder,
    typeOrder,
    setPlanetsData,
    planetsData,
  };

  return (
    <StarwarContext.Provider value={ contextType }>
      {children}
    </StarwarContext.Provider>
  );
}

StarwarProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StarwarProvider;
