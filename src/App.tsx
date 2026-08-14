import { lazy, Suspense } from 'react';
import './App.css'
import { useWeather } from './hooks/useWeather'

import { SplashScreen } from './components/SplashScreen'
const WelcomePage = lazy(() => import('./pages/WelcomePage').then((module) => ({
	default: module.WelcomePage,
})));


function App() {

	const { mode } = useWeather();

	if (mode === "checking") {
		return (
			<SplashScreen />
		)
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
			<Suspense fallback={<SplashScreen />}>
				<div>Here weatherpage</div>
			</Suspense>
		</>
	)
}

export default App
