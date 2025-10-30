import AlertPage from "./pages/components/AlertPage"
import BadgePage from "./pages/components/BadgePage"
import ButtonPage from "./pages/components/ButtonPage"
import CardPage from "./pages/components/CardPage"
import SiderBarPage from "./pages/components/SiderBarPage"
import TextFieldPage from "./pages/components/TextFieldPage"

function App() {
  return (
    <div className="space-y-4">
      {/* This is the Button components page */}
      <ButtonPage />

      {/* This is the TextField components page */}
      <TextFieldPage />

      {/* This is the Badge components page */}
      <BadgePage />

      {/* This is the Alert components page */}
      <AlertPage />

      {/* This is the Card components page */}
      <CardPage />

      {/* This is the SideBar components page */}
      <SiderBarPage />
    </div>
  )
}

export default App
