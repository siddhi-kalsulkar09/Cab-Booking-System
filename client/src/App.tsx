// @ts-expect-error AppRoutes is a JSX module without a TypeScript declaration.
import AppRoutes from "./routes/AppRoutes";

function App() {
  return <AppRoutes />;
}

export default App;