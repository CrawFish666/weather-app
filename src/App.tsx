import { lazy, Suspense } from 'react';
import './App.css'
import { useWeather } from './hooks/useWeather'
import { SplashScreen } from './components/SplashScreen'


const WeatherPage = lazy(() => import('./pages/WeatherPage').then((module) => ({
	default: module.WeatherPage,
})));

const WelcomePage = lazy(() => import('./pages/WelcomePage').then((module) => ({
	default: module.WelcomePage,
})));


function App() {

	const { mode, isWelcomeActionLoading, welcomeLoadingMessage } = useWeather();

	if (mode === "checking" || isWelcomeActionLoading) {
		return <SplashScreen message={welcomeLoadingMessage ?? undefined} />;
	}

	if (mode === "welcome") {
		return (
			<Suspense fallback={<SplashScreen />}>
				<WelcomePage />
			</Suspense>
		)
	}

	return (
		<>
			<Suspense fallback={<SplashScreen message="Открываем прогноз..." />}>
				<WeatherPage />
			</Suspense>
		</>
	)
}

export default App
