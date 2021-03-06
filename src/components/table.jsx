import { Trash } from 'phosphor-react';
import React, { useEffect, useContext } from 'react';
import StarwarContext from '../context/StarwarContext';
import TableInfo from './tableInfo';

function Table() {
  const {
    fetchPlanets,
    searchByName,
    planets,
    filtredPlanets,
    setFiltredPlanets,
    numericFilter,
    setNumericFilter,
    setFiltersType,
    filtersType,
    setPlanetsData,
    planetsData,
    order,
  } = useContext(StarwarContext);

  useEffect(() => {
    fetchPlanets();
  }, []);

  useEffect(() => {
    const filter = planets
      .filter((item) => item.name.toLowerCase().includes(searchByName));

    const newFilter = numericFilter.reduce(
      (acc, filtro) => acc.filter((planet) => {
        switch (filtro.operatorType) {
        case 'menor que':
          return (
            Number(planet[filtro.filterType]) < Number(filtro.valueType)
          );

        case 'maior que':
          return (
            Number(planet[filtro.filterType]) > Number(filtro.valueType)
          );

        case 'igual a':
          return (
            Number(planet[filtro.filterType]) === Number(filtro.valueType)
          );

        default:
          return filter;
        }
      }),
      filter,
    );

    const sortedNewFilter = newFilter.sort((a, b) => {
      const MAGIC = -1;
      if (a.name < b.name) return MAGIC;
      if (a.name > b.name) return 1;
      return 0;
    });

    const unknown = sortedNewFilter.filter(
      (planet) => planet[order.column] === 'unknown',
    );
    const planetsD = sortedNewFilter.filter(
      (planet) => planet[order.column] !== 'unknown',
    );
    setPlanetsData({
      unknownData: unknown,
      planetsOrderedData: planetsD,
    });

    setFiltredPlanets(sortedNewFilter);
  }, [
    searchByName,
    numericFilter,
    planets,
    setFiltredPlanets,
    order,
  ]);

  useEffect(() => {
    let orderedList = [];
    const { unknownData, planetsOrderedData } = planetsData;
    if (order.sort === 'ASC') {
      orderedList = filtredPlanets.sort(
        (a, b) => Number(a[order.column]) - Number(b[order.column]),
      );
      return setFiltredPlanets([...orderedList]);
    }
    if (order.sort === 'DESC') {
      orderedList = filtredPlanets.sort(
        (a, b) => Number(b[order.column]) - Number(a[order.column]),
      );
      return setFiltredPlanets([...orderedList]);
    }
  }, [order]);

  const handleDeleteFilter = ({ target }) => {
    const filterName = target.name;
    const newNumericFilter = numericFilter
      .filter((filter) => filter.filterType !== filterName);
    setNumericFilter(newNumericFilter);
    setFiltersType([...filtersType, filterName]);
  };

  const handleDeleteAll = () => {
    setNumericFilter([]);
    setFiltersType([
      'population',
      'orbital_period',
      'diameter',
      'rotation_period',
      'surface_water',
    ]);
  };

  return (
    <section>
      {/* {numericFilter.length > 0 && <h1>Filtros Aplicado</h1>} */}
      <div className="filters-div">
        {numericFilter.length > 0
        && numericFilter.map((filter) => (
          <div
            className="applied-filter"
            key={ filter.filterType }
            name={ filter.filterType }
            data-testid="filter"
          >
            <span>
              {`${filter.filterType}
            & ${filter.operatorType} ${filter.valueType}`}
            </span>
            <button
              type="button"
              name={ filter.filterType }
              onClick={ handleDeleteFilter }
            >
              <Trash color="yellow" weight="bold" size="24" />
            </button>
          </div>
        ))}
        {numericFilter.length > 0 && (
          <button
            type="button"
            onClick={ handleDeleteAll }
            id="delete-all"
            data-testid="button-remove-filters"
          >
            Clear
          </button>
        )}
      </div>
      <div className="table-div">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Rotation Period</th>
              <th>Orbital Period</th>
              <th>Diameter</th>
              <th>Climate</th>
              <th>Gravity</th>
              <th>Terrain</th>
              <th>Surface Water</th>
              <th>Population</th>
              {/* <th>Films</th>
              <th>Created</th>
              <th>Edited</th>
              <th>URL</th> */}
            </tr>
          </thead>
          {filtredPlanets.length === 0
            ? null
            : filtredPlanets.map((planet, i) => (
              <TableInfo key={ i } planet={ planet } />
            ))}
          <TableInfo />
        </table>
      </div>
    </section>
  );
}

export default Table;
