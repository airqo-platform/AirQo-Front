import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSelectedLocations,
  getSitesSummary,
  setGridsSummary,
} from '@/lib/store/services/deviceRegistry/GridsSlice';
import SearchIcon from '@/icons/Common/search_md.svg';
import LocationIcon from '@/icons/SideBar/Sites.svg';
import TrashIcon from '@/icons/Actions/bin_icon.svg';
import StarIcon from '@/icons/Actions/star_icon.svg';
import StarIconLight from '@/icons/Actions/star_icon_light.svg';
import DragIcon from '@/icons/Actions/drag_icon.svg';
import DragIconLight from '@/icons/Actions/drag_icon_light.svg';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Spinner from '@/components/Spinner';
import AlertBox from '@/components/AlertBox';
import useOutsideClick from '@/core/utils/useOutsideClick';
import SearchField from '@/components/search/SearchField';
import axios from 'axios';
import { getNearestSite, getGridsSummaryApi } from '@/core/apis/DeviceRegistry';
import { addSearchTerm } from '@/lib/store/services/search/LocationSearchSlice';
import allCountries from '../Map/components/countries.json';

const SearchResultsSkeleton = () => (
  <div className='flex flex-col gap-1 animate-pulse'>
    <div className='bg-secondary-neutral-dark-50 rounded-xl w-full h-6' />
    <div className='bg-secondary-neutral-dark-50 rounded-xl w-full h-6' />
    <div className='bg-secondary-neutral-dark-50 rounded-xl w-full h-6' />
    <div className='bg-secondary-neutral-dark-50 rounded-xl w-full h-6' />
    <div className='bg-secondary-neutral-dark-50 rounded-xl w-full h-6' />
  </div>
);

/**
 * @param {Object} props
 * @returns {JSX.Element}
 * @description Renders the location item cards
 * and handles the location selection and removal
 * and reordering of the selected locations
 */
const LocationItemCards = ({
  location,
  handleLocationSelect,
  handleRemoveLocation,
  draggableProps,
  dragHandleProps,
  innerRef,
  showTrashIcon = false,
  showActiveStarIcon = true,
}) => (
  <div
    className='border rounded-lg bg-secondary-neutral-light-25 border-input-light-outline flex flex-row justify-between items-center p-3 w-full mb-2'
    key={location.name}
    ref={innerRef}
    {...draggableProps}
    {...dragHandleProps}
  >
    <div className='flex flex-row items-center overflow-x-clip'>
      <div>{showActiveStarIcon ? <DragIcon /> : <DragIconLight />}</div>
      <span className='text-sm text-secondary-neutral-light-800 font-medium'>{location.name}</span>
    </div>
    <div className='flex flex-row'>
      {showTrashIcon && (
        <div className='mr-1 hover:cursor-pointer' onClick={() => handleRemoveLocation(location)}>
          <TrashIcon />
        </div>
      )}
      {showActiveStarIcon ? (
        <div
          className='bg-primary-600 rounded-md p-2 flex items-center justify-center hover:cursor-pointer'
          onClick={() => handleLocationSelect(location)}
        >
          <StarIcon />
        </div>
      ) : (
        <div
          className='border border-input-light-outline rounded-md p-2 flex items-center justify-center hover:cursor-pointer'
          onClick={() => handleLocationSelect(location)}
        >
          <StarIconLight />
        </div>
      )}
    </div>
  </div>
);

/**
 * @param {Object} props
 * @returns {JSX.Element}
 * @description Renders the no suggestions message
 * when there are no suggestions or locations found
 */
const NoSuggestions = ({ message }) => (
  <div className='flex flex-row justify-center mt-[60px] items-center mb-0.5 text-sm w-full'>
    <div className='text-sm ml-1 text-black font-medium capitalize'>{message}</div>
  </div>
);

const LocationsContentComponent = ({ selectedLocations, resetSearchData = false }) => {
  const dispatch = useDispatch();
  const searchRef = useRef(null);
  const sitesData = useSelector((state) => state.grids.sitesSummary);
  const sitesLocationsData = (sitesData && sitesData.sites) || [];
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const gridsSummaryData = useSelector((state) => state.grids.gridsSummary);
  const reduxSearchTerm = useSelector((state) => state.locationSearch.searchTerm);

  const [inputSelect, setInputSelect] = useState(false);
  const [locationArray, setLocationArray] = useState(selectedLocations);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [unSelectedLocations, setUnSelectedLocations] = useState([]);
  const [draggedLocations, setDraggedLocations] = useState(selectedLocations);
  const [isError, setIsError] = useState({
    isError: false,
    message: '',
    type: '',
  });
  const [isFocused, setIsFocused] = useState(false);
  const [airqoCountries, setAirqoCountries] = useState([]);

  const focus = isFocused || reduxSearchTerm.length > 0;

  useEffect(() => {
    const fetchGridsData = async () => {
      if (!gridsSummaryData) {
        try {
          const response = await getGridsSummaryApi();
          if (response && response.success) {
            dispatch(setGridsSummary(response.grids));
          }
        } catch (error) {
          console.error('Failed to get grids summary:', error);
        }
      }
    };
    fetchGridsData();
  }, []);

  useEffect(() => {
    if (gridsSummaryData && gridsSummaryData.length > 0) {
      // Check if selected grid admin_level is country
      const countryNames = gridsSummaryData
        .filter((grid) => grid.admin_level.toLowerCase() === 'country')
        .map((country) => country.name.toLowerCase());

      setAirqoCountries(countryNames);
    }
  }, [gridsSummaryData]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (sitesLocationsData && sitesLocationsData.length < 1) {
          await dispatch(getSitesSummary());
        }
      } catch (error) {
        return;
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (sitesLocationsData && sitesLocationsData.length > 0) {
      try {
        dispatch(setSelectedLocations(locationArray));
        while (unSelectedLocations.length < 8) {
          const randomIndex = Math.floor(Math.random() * sitesLocationsData.length);
          const randomObject = sitesLocationsData[randomIndex];
          if (!unSelectedLocations.find((location) => location._id === randomObject._id)) {
            unSelectedLocations.push(randomObject);
          }
        }
      } catch (error) {
        return;
      }
    }
  }, [locationArray, sitesLocationsData]);

  /**
   * @param {Object} e
   * @returns {void}
   * @description Handles the location entry and filters the locations based on the search query
   */
  const handleLocationEntry = async () => {
    setInputSelect(false);
    setIsLoadingResults(true);
    if (reduxSearchTerm && reduxSearchTerm.length > 3) {
      try {
        // Create a new AutocompleteService instance
        const autocompleteService = new google.maps.places.AutocompleteService();

        // Call getPlacePredictions to retrieve autocomplete suggestions
        autocompleteService.getPlacePredictions(
          {
            input: reduxSearchTerm,
            types: ['establishment', 'geocode'],
          },
          (predictions, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              // Filter predictions to include only those within the specified countries
              const filteredPredictions = predictions.filter((prediction) => {
                return airqoCountries.some((country) =>
                  prediction.description.toLowerCase().includes(country.toLowerCase()),
                );
              });

              // Retrieve the details of each prediction to get latitude and longitude
              const locationPromises = filteredPredictions.map((prediction) => {
                return new Promise((resolve, reject) => {
                  const placesService = new google.maps.places.PlacesService(
                    document.createElement('div'),
                  );
                  placesService.getDetails(
                    { placeId: prediction.place_id },
                    (place, placeStatus) => {
                      if (placeStatus === google.maps.places.PlacesServiceStatus.OK) {
                        resolve({
                          description: prediction.description,
                          latitude: place.geometry.location.lat(),
                          longitude: place.geometry.location.lng(),
                          place_id: prediction.place_id,
                        });
                      } else {
                        reject(
                          new Error(`Failed to retrieve details for ${prediction.description}`),
                        );
                      }
                    },
                  );
                });
              });

              // Resolve all location promises to get the latitude and longitude for each prediction
              Promise.all(locationPromises)
                .then((locations) => {
                  setFilteredLocations(locations);
                  setIsLoadingResults(false);
                })
                .catch((error) => {
                  console.error('Failed to retrieve location details:', error);
                  setIsLoadingResults(false);
                });
            } else {
              console.error('Autocomplete search failed with status:', status);
              setIsLoadingResults(false);
            }
          },
        );
      } catch (error) {
        console.error('Failed to search:', error);
      } finally {
        setIsLoadingResults(false);
      }
    } else {
      setFilteredLocations([]);
    }
  };

  const resetSearch = () => {
    dispatch(addSearchTerm(''));
    setIsFocused(false);
    setFilteredLocations(unSelectedLocations);
  };

  /**
   * @param {Object} e
   * @returns {void}
   * @description hides the search dropdown when clicked outside the search dropdown
   * and resets the search input
   */
  useOutsideClick(searchRef, () => {
    dispatch(addSearchTerm(''));
    setFilteredLocations(unSelectedLocations);
    setInputSelect(!inputSelect);
  });

  /**
   * @param {Object} item
   * @returns {void}
   * @description Handles the selection of a location and adds it to the selected locations
   * array
   */
  const handleLocationSelect = async (item) => {
    dispatch(addSearchTerm(''));
    try {
      let newLocationValue;
      if (item?.place_id) {
        const response = await getNearestSite({
          latitude: item?.latitude,
          longitude: item?.longitude,
          radius: 4,
        });

        if (response.sites && response.sites.length > 0) {
          newLocationValue = {
            ...response.sites[Math.floor(Math.random() * response.sites.length)],
            name: item?.description,
            long_name: item?.description,
          };
        } else {
          setIsError({
            isError: true,
            message: `Can't find air quality for ${
              item?.description?.split(',')[0]
            }. Please try another location.`,
            type: 'error',
          });
          return;
        }
      } else {
        newLocationValue = item;
      }

      const newLocationArray = [...locationArray];
      const index = newLocationArray.findIndex(
        (location) => location.name === newLocationValue.name,
      );
      if (index !== -1) {
        setIsError({
          isError: true,
          message: 'Location already added',
          type: 'error',
        });
        return;
      } else if (newLocationArray.length < 4) {
        newLocationArray.push(newLocationValue);
        const unselectedIndex = unSelectedLocations.findIndex(
          (location) => location.name === newLocationValue.name,
        );
        unSelectedLocations.splice(unselectedIndex, 1);
      } else {
        setIsError({
          isError: true,
          message:
            'You have reached the limit of 4 locations. Please remove a location before adding another.',
          type: 'error',
        });
        return;
      }
      setLocationArray(newLocationArray);
      setDraggedLocations(newLocationArray);
      setInputSelect(true);
    } catch (error) {
      console.error('Failed to get nearest site:', error);
    }
  };

  /**
   * @param {Object} item
   * @returns {void}
   * @description Removes a location from the selected locations array
   * and adds it back to the unselected locations array
   * and updates the selected locations array in the redux store
   * and updates the dragged locations array
   * and updates the unselected locations array
   */
  const removeLocation = (item) => {
    const newLocationSet = new Set(locationArray.map((location) => location.name));
    newLocationSet.delete(item.name);
    const newLocationArray = Array.from(newLocationSet, (name) =>
      locationArray.find((location) => location.name === name),
    );
    setLocationArray(newLocationArray);
    setDraggedLocations(newLocationArray);
    setUnSelectedLocations((locations) =>
      locations.filter((location) => location.name !== item.name),
    );
    dispatch(setSelectedLocations(newLocationArray));
  };

  /**
   * @param {Object} result
   * @returns {void}
   * @description Reorders the selected locations array based on the drag and drop
   * and updates the dragged locations array
   */
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(draggedLocations);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setDraggedLocations(items);
  };

  useEffect(() => {
    if (reduxSearchTerm !== '' && reduxSearchTerm.length < 4) {
      setIsLoadingResults(true);
    }
  }, [reduxSearchTerm]);

  useEffect(() => {
    if (resetSearchData) {
      resetSearch();
    }
  }, [resetSearchData]);

  useEffect(() => {
    resetSearch();
  }, []);

  if (isLoading) {
    return (
      <div className='flex flex-row mt-[100px] justify-center items-center'>
        <Spinner data-testid='spinner' width={25} height={25} />
      </div>
    );
  }

  return (
    <div>
      <div className='mt-6'>
        <SearchField
          onSearch={handleLocationEntry}
          onClearSearch={resetSearch}
          focus={focus}
          showSearchResultsNumber={false}
        />
        {reduxSearchTerm !== '' && (
          <div
            ref={searchRef}
            className={`bg-white max-h-48 overflow-y-scroll px-3 pt-2 pr-1 my-1 border border-input-light-outline rounded-md ${
              inputSelect ? 'hidden' : 'relative'
            }`}
          >
            {isLoadingResults ? (
              <SearchResultsSkeleton />
            ) : filteredLocations && filteredLocations.length > 0 ? (
              filteredLocations.map((location) => (
                <div
                  className='flex items-center mb-0.5 hover:cursor-pointer gap-2'
                  onClick={() => {
                    handleLocationSelect(location);
                  }}
                  key={location.place_id}
                >
                  <LocationIcon />
                  <div className='text-sm text-black capitalize text-nowrap w-56 md:w-96 lg:w-72 overflow-hidden text-ellipsis'>
                    {location?.description?.split(',')[0].length > 35
                      ? location?.description?.split(',')[0].substring(0, 35) + '...'
                      : location?.description?.split(',')[0]}
                    {location?.description?.split(',').length > 1 && (
                      <span className='text-grey-400'>
                        {location?.description?.split(',').slice(1).join(',').length > 35
                          ? `${location?.description
                              ?.split(',')
                              .slice(1)
                              .join(',')
                              .substring(0, 35)}...`
                          : location?.description?.split(',').slice(1).join(',')}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className='flex flex-row justify-start items-center mb-0.5 text-sm w-full'>
                <LocationIcon />
                <div className='text-sm ml-1 text-black font-medium capitalize'>
                  Location not found
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='starredLocations'>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <div className='mt-4'>
                {locationArray && locationArray.length > 0 ? (
                  draggedLocations.map((location, index) => (
                    <Draggable key={location.name} draggableId={location.name} index={index}>
                      {(provided) => (
                        <LocationItemCards
                          key={location.name}
                          handleLocationSelect={handleLocationSelect}
                          handleRemoveLocation={removeLocation}
                          location={location}
                          draggableProps={provided.draggableProps}
                          dragHandleProps={provided.dragHandleProps}
                          innerRef={provided.innerRef}
                          showTrashIcon={true}
                          showActiveStarIcon={true}
                        />
                      )}
                    </Draggable>
                  ))
                ) : (
                  <NoSuggestions message='No locations selected' />
                )}
              </div>
              <div className='mt-6 mb-24'>
                <h3 className='text-sm text-black-800 font-semibold'>Suggestions</h3>
                <div className='my-1'>
                  <AlertBox
                    message={isError.message}
                    type={isError.type}
                    show={isError.isError}
                    hide={() =>
                      setIsError({
                        isError: false,
                        message: '',
                        type: '',
                      })
                    }
                  />
                </div>
                <div className='mt-3'>
                  {unSelectedLocations && unSelectedLocations.length > 0 ? (
                    unSelectedLocations
                      .slice(0, 15)
                      .map((location) => (
                        <LocationItemCards
                          key={location.search_name}
                          location={location}
                          handleLocationSelect={handleLocationSelect}
                          showActiveStarIcon={false}
                        />
                      ))
                  ) : (
                    <NoSuggestions message='No suggestions' />
                  )}
                </div>
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default LocationsContentComponent;
