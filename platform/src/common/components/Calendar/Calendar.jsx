import React, { useEffect, useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isWithinInterval,
  isSameDay,
  isBefore,
  isSameMonth,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import Footer from './components/Footer';
import ShortCuts from './components/ShortCuts';
import CalendarHeader from './components/CalendarHeader';

const Calendar = ({
  initialMonth1,
  initialMonth2,
  handleValueChange,
  closeDatePicker,
  showAsSingle = false,
  useRange = true,
}) => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [selectedDays1, setSelectedDays1] = useState([]);
  const [selectedDays2, setSelectedDays2] = useState([]);
  const [month1, setMonth1] = useState(initialMonth1);
  const [month2, setMonth2] = useState(initialMonth2);
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });

  useEffect(() => {
    if (!useRange && showAsSingle) {
      setSelectedRange({ start: new Date(), end: null });
      setSelectedDays1((prev) => [...prev, new Date()]);
    }
  }, [useRange, showAsSingle]);

  const handleDayClick = (day, setSelectedDays) => {
    if (!useRange) {
      const newDay = new Date(month2.getFullYear(), month2.getMonth(), day.getDate());
      setSelectedDays((prev) => [...prev, newDay]);
      setSelectedRange({ start: newDay, end: null });
    } else if (!selectedRange.start) {
      setSelectedDays((prev) => [...prev, day]);
      setSelectedRange({ start: day, end: null });
    } else if (!selectedRange.end) {
      setSelectedDays((prev) => [...prev, day]);
      if (isBefore(day, selectedRange.start)) {
        setSelectedRange({ start: day, end: selectedRange.start });
      } else {
        setSelectedRange({ start: selectedRange.start, end: day });
      }
    } else {
      setSelectedDays([day]);
      setSelectedRange({ start: day, end: null });
    }
  };

  const renderDays = (month, selectedDays, setSelectedDays) => {
    const startDay = startOfWeek(startOfMonth(month));
    const endDay = endOfWeek(endOfMonth(month));
    const daysOfMonth = eachDayOfInterval({
      start: startDay,
      end: endDay,
    });

    return daysOfMonth.map((day, index) => {
      let isStartOrEndDay =
        (selectedRange.start && isSameDay(day, selectedRange.start)) ||
        (selectedRange.end && isSameDay(day, selectedRange.end));
      let isInBetween =
        selectedRange.start &&
        selectedRange.end &&
        isWithinInterval(day, selectedRange) &&
        !isStartOrEndDay;
      let isStartOfWeek = index % 7 === 0;
      let isEndOfWeek = index % 7 === 6;
      let isToday = isSameDay(day, new Date());
      let isCurrentMonth = isSameMonth(day, month);

      return (
        <div
          key={day}
          className={`flex justify-center items-center ${
            isInBetween || isStartOrEndDay ? 'bg-gray-100 text-gray-800 dark:bg-gray-800' : ''
          } ${
            (selectedRange.start && isSameDay(day, selectedRange.start)) || isStartOfWeek
              ? 'rounded-l-full'
              : ''
          } ${
            (selectedRange.end && isSameDay(day, selectedRange.end)) || isEndOfWeek
              ? 'rounded-r-full'
              : ''
          }`}
        >
          <button
            onClick={() => handleDayClick(day, setSelectedDays)}
            className={`
              w-10 h-10 text-sm flex justify-center items-center 
              ${
                selectedDays.includes(day) || isStartOrEndDay
                  ? 'bg-blue-600 dark:bg-blue-500 rounded-full text-red-50 hover:text-red-50'
                  : ''
              }
              ${
                isToday
                  ? 'text-blue-600'
                  : isCurrentMonth
                  ? 'text-gray-800 dark:text-gray-200'
                  : 'text-gray-300'
              }
              hover:border-blue-600 hover:text-blue-600 hover:rounded-full hover:border dark:hover:border-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 
              disabled:text-gray-300 disabled:pointer-events-none md:w-14 lg:w-16
            `}
          >
            {format(day, 'd')}
          </button>
        </div>
      );
    });
  };

  return (
    <div
      className={
        !showAsSingle && useRange
          ? 'flex flex-col items-center justify-center w-full bg-none md:flex-row mb-10 z-[900]'
          : ''
      }
    >
      <div
        className={`z-[900] border border-gray-100 bg-white shadow-lg rounded-xl ${
          !showAsSingle && useRange
            ? 'max-w-full min-w-[260px] md:min-w-[660px] lg:min-w-[800px]'
            : 'max-w-[328px] w-full min-w-40'
        }`}
      >
        <div className='flex flex-col'>
          <div className='divide-x flex flex-col md:flex-row lg:flex-row'>
            {/* shortcut section */}
            {!showAsSingle && useRange && <ShortCuts setSelectedRange={setSelectedRange} />}

            {/* calendar section one */}
            <div className='flex flex-col px-6 pt-5 pb-6'>
              <CalendarHeader
                month={format(useRange ? month1 : month2, 'MMMM yyyy')}
                onNext={() => {
                  const nextMonth = addMonths(useRange ? month1 : month2, 1);
                  if (useRange) {
                    if (!isSameMonth(nextMonth, month2)) {
                      setMonth1(nextMonth);
                    }
                  } else {
                    setMonth2(nextMonth);
                  }
                }}
                onPrev={() => {
                  const prevMonth = subMonths(useRange ? month1 : month2, 1);
                  if (useRange) {
                    if (!isSameMonth(prevMonth, month2)) {
                      setMonth1(prevMonth);
                    }
                  } else {
                    setMonth2(prevMonth);
                  }
                }}
              />
              <div className='grid grid-cols-7 text-xs text-center text-gray-900 space-y-[1px]'>
                {daysOfWeek.map((day) => (
                  <span
                    key={day}
                    className='flex text-gray-600 items-center justify-center w-10 h-10 font-semibold rounded-lg'
                  >
                    {day}
                  </span>
                ))}
                {renderDays(month1, selectedDays1, setSelectedDays1, selectedRange)}
              </div>
            </div>
            {/* calendar section two */}
            {useRange && (
              <div className='flex flex-col px-6 pt-5 pb-6'>
                <CalendarHeader
                  month={format(month2, 'MMMM yyyy')}
                  onNext={() => {
                    const nextMonth = addMonths(month2, 1);
                    if (!isSameMonth(nextMonth, month1)) {
                      setMonth2(nextMonth);
                    }
                  }}
                  onPrev={() => {
                    const prevMonth = subMonths(month2, 1);
                    if (!isSameMonth(prevMonth, month1)) {
                      setMonth2(prevMonth);
                    }
                  }}
                />
                <div className='grid grid-cols-7 text-xs text-center text-gray-900 space-y-[1px]'>
                  {daysOfWeek.map((day) => (
                    <span
                      key={day}
                      className='flex text-gray-600 items-center justify-center w-10 h-10 font-semibold rounded-lg'
                    >
                      {day}
                    </span>
                  ))}
                  {renderDays(month2, selectedDays2, setSelectedDays2)}
                </div>
              </div>
            )}
          </div>
          {/* footer section */}
          <Footer
            useRange={useRange}
            selectedRange={selectedRange}
            setSelectedRange={setSelectedRange}
            handleValueChange={handleValueChange}
            close={closeDatePicker}
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
