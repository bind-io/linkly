import { MainPage } from "./pages/main";
import { ToastProvider } from "./components/toast";

function App() {
  return (
    <>
      <ToastProvider />
      <MainPage />
    </>
  );
}

export default App;
