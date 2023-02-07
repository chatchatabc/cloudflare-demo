import React, {useState} from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Login from './Login'
import './index.css'
import Cookies from "js-cookie";

const hasAuth = Cookies.get("ID");

// const [count, setCount] = useState(1)
//
// if (cookie === undefined) {
//     return <Login />
// }

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div className="w-[100vw]">
        {/*<App />*/}
        { hasAuth === undefined ? <Login /> : <App />}
        {/*<App />*/}
    </div>

  </React.StrictMode>,
)
