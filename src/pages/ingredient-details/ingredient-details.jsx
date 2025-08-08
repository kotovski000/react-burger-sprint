import { useParams } from 'react-router-dom';
import IngredientDetails from '../../components/ingredient-details/ingredient-details';
import styles from './ingredient-details.module.css';

const IngredientDetailsPage = () => {
    const { id } = useParams();

    return (
        <div className={styles.container}>
            <h1 className={`text text_type_main-large ${styles.title}`}>Детали ингредиента</h1>
            <IngredientDetails ingredientId={id} />
        </div>
    );
};

export default IngredientDetailsPage;