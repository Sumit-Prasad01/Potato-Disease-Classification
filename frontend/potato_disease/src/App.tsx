import {Navbar} from './layouts/navbar';
import {Footer} from './layouts/Footer';
// import { Outlet } from 'react-router-dom';

const App = () => {
  return (
    <>
    <main className="flex-grow pt-28 px-4 pb-24">
      <Navbar/>
      {/* {Outlet} */}
      <Footer/>
    </main>
      
    </>
  );
};

export default App;
