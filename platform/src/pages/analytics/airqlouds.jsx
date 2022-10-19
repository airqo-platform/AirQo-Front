import Layout from '@/components/Layout';
import {
  useGetAllAirQloudsQuery,
  getRunningOperationPromises,
} from '@/lib/store/airQloudsApi';
import { wrapper } from '@/lib/store';
import ChevronRightIcon from '@/icons/chevron_right';
import { useState } from 'react';
import { Tab } from '@headlessui/react';
import Spinner from '@/icons/spinner';
import { Dropdown } from 'flowbite-react';

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const name = context.params?.name;

    if (typeof name === 'string') {
      store.dispatch(useGetAllAirQloudsQuery.initiate(name));
    }

    await Promise.all(getRunningOperationPromises());

    return {
      props: {},
    };
  },
);

const AIRQLOUD_REGIONS = [
  'All',
  'Central Region',
  'Eastern Region',
  'Northen Region',
  'Western Region',
];

const AirQloudsDropdown = ({ airqlouds }) => {
  const [selectedAirQloud, setSelectedAirQloud] = useState(airqlouds[0]);
  const handleSetAirQloud = (value) => setSelectedAirQloud(value);

  return (
    <Dropdown label={selectedAirQloud.long_name} inline>
      <div className='max-h-40 h-full overflow-y-scroll'>
        {airqlouds.map((airqloud) => (
          <Dropdown.Item
            key={airqloud._id}
            onClick={() => handleSetAirQloud(airqloud)}
          >
            {airqloud.long_name}
          </Dropdown.Item>
        ))}
      </div>
    </Dropdown>
  );
};

const RegionTabs = () => (
  <div className='w-full'>
    <Tab.Group>
      <Tab.List>
        {AIRQLOUD_REGIONS.map((region) => (
          <Tab
            key={region}
            className='ui-selected:border-b-2 ui-selected:border-b-black ui-selected:opacity-100 font-medium text-sm pb-1 cursor-pointer mr-[26px] opacity-40 outline-none'
          >
            {region}
          </Tab>
        ))}
        <hr className='w-full' />
      </Tab.List>
      {/* <Tab.Panels>
        <Tab.Panel>Content 1</Tab.Panel>
        <Tab.Panel>Content 2</Tab.Panel>
        <Tab.Panel>Content 3</Tab.Panel>
      </Tab.Panels> */}
    </Tab.Group>
  </div>
);

const AirQlouds = () => {
  const {
    data: airqlouds,
    isLoading,
    // isSuccess,
    // isError,
    // error,
  } = useGetAllAirQloudsQuery();
  const airqloudsData = !isLoading && airqlouds.airqlouds;

  return isLoading ? (
    <div className='w-screen h-screen flex items-center justify-center'>
      <Spinner />
    </div>
  ) : (
    <Layout>
      <div className='m-6'>
        <span className='flex items-center mb-[33px]'>
          <h3 className='text-xl font-medium text-black opacity-40 mr-3'>
            Analytics
          </h3>
          <ChevronRightIcon strokeWidth={1.5} stroke='#E3E3E3' />
          <h3 className='text-xl font-medium text-black ml-3'>AirQlouds</h3>
        </span>
        <div className='mb-5'>
          <AirQloudsDropdown airqlouds={airqloudsData} />
        </div>
        <div className='flex'>
          <RegionTabs />
        </div>
      </div>
    </Layout>
  );
};
export default AirQlouds;
