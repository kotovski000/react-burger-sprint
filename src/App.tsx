import { ingredients } from './utils/data';
import AppHeader from './components/app-header/app-header';
import BurgerIngredients from './components/burger-ingredients/burger-ingredients';
import BurgerConstructor from './components/burger-constructor/burger-constructor';
import styles from './app.module.css';

function App() {
  return (
      <div className={styles.app}>
        <AppHeader />
        <main className={styles.main}>
          <BurgerIngredients ingredients={ingredients} />
          <BurgerConstructor ingredients={ingredients} />
        </main>
      </div>
  );
}

export default App;