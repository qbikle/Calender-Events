import './App.css'
import Calendar from './components/Calender'

function App() {

  return (
    <>
    <h1 className="text-center text-4xl font-bold mb-2">
      My Calender</h1>
      <p className="text-center text-2xl border-t text-neutral-400 mb-5">
        Manage your events here!
      </p>
      <Calendar />
    </>
  )
}

export default App
