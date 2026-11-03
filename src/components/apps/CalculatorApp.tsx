import React, { useState } from 'react';
import { soundFX } from '../../utils/soundEffects';

export const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prevVal, setPrevVal] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    soundFX.playToggleClick();
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    soundFX.playToggleClick();
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    soundFX.playToggleClick();
    setDisplay('0');
    setPrevVal(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOp: string) => {
    soundFX.playToggleClick();
    const inputValue = parseFloat(display);

    if (prevVal === null) {
      setPrevVal(inputValue);
    } else if (operation) {
      const current = prevVal || 0;
      let result = current;
      if (operation === '+') result = current + inputValue;
      if (operation === '-') result = current - inputValue;
      if (operation === '×') result = current * inputValue;
      if (operation === '÷') result = inputValue !== 0 ? current / inputValue : 0;

      setPrevVal(result);
      setDisplay(String(result).slice(0, 9));
    }

    setWaitingForOperand(true);
    setOperation(nextOp);
  };

  const equals = () => {
    if (!operation || prevVal === null) return;
    performOperation('=');
    setOperation(null);
  };

  return (
    <div className="flex flex-col h-full bg-black text-white p-4 pt-10 pb-16 justify-between select-none">
      {/* Display */}
      <div className="h-28 flex items-end justify-end px-3">
        <span className="text-5xl font-light tracking-tight truncate font-mono">{display}</span>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-4 gap-3">
        {/* Row 1 */}
        <button
          type="button"
          onClick={clear}
          className="w-16 h-16 rounded-full bg-zinc-400 hover:bg-zinc-300 active:bg-zinc-200 text-black font-semibold text-lg"
        >
          AC
        </button>
        <button
          type="button"
          onClick={() => {
            soundFX.playToggleClick();
            setDisplay(String(-parseFloat(display)));
          }}
          className="w-16 h-16 rounded-full bg-zinc-400 hover:bg-zinc-300 active:bg-zinc-200 text-black font-semibold text-lg"
        >
          ±
        </button>
        <button
          type="button"
          onClick={() => {
            soundFX.playToggleClick();
            setDisplay(String(parseFloat(display) / 100));
          }}
          className="w-16 h-16 rounded-full bg-zinc-400 hover:bg-zinc-300 active:bg-zinc-200 text-black font-semibold text-lg"
        >
          %
        </button>
        <button
          type="button"
          onClick={() => performOperation('÷')}
          className="w-16 h-16 rounded-full bg-amber-500 hover:bg-amber-400 text-white font-bold text-2xl"
        >
          ÷
        </button>

        {/* Row 2 */}
        {['7', '8', '9'].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => inputDigit(d)}
            className="w-16 h-16 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white font-normal text-2xl"
          >
            {d}
          </button>
        ))}
        <button
          type="button"
          onClick={() => performOperation('×')}
          className="w-16 h-16 rounded-full bg-amber-500 hover:bg-amber-400 text-white font-bold text-2xl"
        >
          ×
        </button>

        {/* Row 3 */}
        {['4', '5', '6'].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => inputDigit(d)}
            className="w-16 h-16 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white font-normal text-2xl"
          >
            {d}
          </button>
        ))}
        <button
          type="button"
          onClick={() => performOperation('-')}
          className="w-16 h-16 rounded-full bg-amber-500 hover:bg-amber-400 text-white font-bold text-2xl"
        >
          -
        </button>

        {/* Row 4 */}
        {['1', '2', '3'].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => inputDigit(d)}
            className="w-16 h-16 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white font-normal text-2xl"
          >
            {d}
          </button>
        ))}
        <button
          type="button"
          onClick={() => performOperation('+')}
          className="w-16 h-16 rounded-full bg-amber-500 hover:bg-amber-400 text-white font-bold text-2xl"
        >
          +
        </button>

        {/* Row 5 */}
        <button
          type="button"
          onClick={() => inputDigit('0')}
          className="col-span-2 h-16 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white font-normal text-2xl px-6 text-left"
        >
          0
        </button>
        <button
          type="button"
          onClick={inputDecimal}
          className="w-16 h-16 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white font-normal text-2xl"
        >
          .
        </button>
        <button
          type="button"
          onClick={equals}
          className="w-16 h-16 rounded-full bg-amber-500 hover:bg-amber-400 text-white font-bold text-2xl"
        >
          =
        </button>
      </div>
    </div>
  );
};
