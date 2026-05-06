import { useText, changeLanguage } from './i18n';
import Signal from '../electron/Signal';
import { channel } from '@/channel';
import { useCounterStore } from '@/store';

export function App() {
  const t = useText();
  const { count, increment, decrement, reset } = useCounterStore();

  const cl = (lng: Parameters<typeof changeLanguage>[0]) => {
    changeLanguage(lng);
    channel.send(Signal.LanguageChanged, lng);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="font-bold text-2xl text-amber-950 mb-6">{t('hello')}</h1>
      <div className="flex gap-6 mb-12">
        <button
          onClick={() => cl('en')}
          className="px-8 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-xl font-semibold shadow-lg hover:shadow-xl"
        >
          {t('english')}
        </button>
        <button
          onClick={() => cl('zh')}
          className="px-8 py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors text-xl font-semibold shadow-lg hover:shadow-xl"
        >
          {t('chinese')}
        </button>
      </div>

      <div className="flex flex-col items-center gap-6 mt-12">
        <div className="text-8xl font-bold text-gray-800 mb-6">{count}</div>
        <div className="flex gap-6">
          <button
            onClick={decrement}
            className="px-10 py-5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-2xl font-bold shadow-lg hover:shadow-xl min-w-[80px]"
          >
            -
          </button>
          <button
            onClick={reset}
            className="px-10 py-5 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors text-xl font-bold shadow-lg hover:shadow-xl"
          >
            {t('reset')}
          </button>
          <button
            onClick={increment}
            className="px-10 py-5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors text-2xl font-bold shadow-lg hover:shadow-xl min-w-[80px]"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
