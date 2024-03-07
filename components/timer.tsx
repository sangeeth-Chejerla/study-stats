"use client"


import React, { useEffect, useState } from "react";
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { useLocalStorageState } from 'ahooks';

type Mode = 'light' | 'dark';

const Timer: React.FC = () => {
  const [timerKey, setTimerKey] = useState<number>(0);
  const [time, setTime] = useLocalStorageState<number>('study-time', { defaultValue: 600 });
  // Initial time in seconds (10 minutes)
  const [breakTime, setBreakTime] = useState<number>(300); // Break time in seconds (5 minutes)
  const [mode, setMode] = useState<Mode>('light'); // Default mode is light
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff'); // Default light mode background color
  const [textColor, setTextColor] = useState<string>('#000000'); // Default light mode text color
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isStudyTime, setIsStudyTime] = useState<boolean>(true);
  const [totalStudyingTime, setTotalStudyingTime] = useLocalStorageState<number>('total-studying-time', 0);

  useEffect(() => {
    if (isStudyTime && typeof time === 'number') {
        setTotalStudyingTime((prevTotal: number | undefined) => (prevTotal || 0) + time);
    }
  }, [time, isStudyTime, setTotalStudyingTime]);

  useEffect(() => {
    setTotalStudyingTime((prevTotal: number | undefined) => prevTotal || 0); // Initialize total studying time if it's not set
  }, [setTotalStudyingTime]);

  const toggleMode = () => {
    setMode((prevMode: Mode) => (prevMode === 'light' ? 'dark' : 'light'));
    // Toggle background and text colors based on the mode
    if (mode === 'light') {
      setBackgroundColor('#000000');
      setTextColor('#ffffff');
    } else {
      setBackgroundColor('#ffffff');
      setTextColor('#000000');
    }
  };

  const resetTimer = () => {
    setTimerKey((prevKey: number) => prevKey + 1);
    setIsPaused(false);
    setIsStudyTime(true);
  };

  const children = ({ remainingTime }: { remainingTime: number }) => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleTimerCompletion = () => {
    resetTimer();
    setIsStudyTime(!isStudyTime);
    if (!isStudyTime) {
      alert('Break time completed! Back to studying.');
    } else {
      alert('Study time completed! Take a break.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor, color: textColor }}>
      <h1 className="text-3xl font-bold mb-8">Study stats Timer</h1>
      <div className="flex items-center space-x-4 mb-4">
        <label htmlFor="study-time">Study Time (minutes):</label>
        <input
          type="number"
          id="study-time"
          value={Math.floor(time! / 60)}
          onChange={e => setTime(parseInt(e.target.value) * 60)}
          className="p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="flex items-center space-x-4 mb-4">
        <label htmlFor="break-time">Break Time (minutes):</label>
        <input
          type="number"
          id="break-time"
          value={Math.floor(breakTime / 60)}
          onChange={e => setBreakTime(parseInt(e.target.value) * 60)}
          className="p-2 border border-gray-300 rounded"
        />
      </div>
      <CountdownCircleTimer
        key={timerKey}
        isPlaying={!isPaused}
        duration={isStudyTime ? time || 0 : breakTime || 0}// Removed the unnecessary colon
        colors={[['#A30000']]}
        onComplete={handleTimerCompletion}
      >
        {children}
      </CountdownCircleTimer>
      <div className="mt-4">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="px-4 py-2 mr-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button
          onClick={resetTimer}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reset Timer
        </button>
        <button
          onClick={toggleMode}
          className="px-4 py-2 ml-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Toggle Mode
        </button>
      </div>
      <div className="mt-4">
        <p>Total Studying Time: {Math.floor(totalStudyingTime! / 60)} minutes</p>
      </div>
    </div>
  );
};

export default Timer;
