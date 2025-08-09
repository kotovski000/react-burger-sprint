import IngredientDetails from '../../components/ingredient-details/ingredient-details';
import styles from './ingredient-details.module.css';

const IngredientDetailsPage = () => {
	return (
		<div className={styles.container}>
			<h1 className={`text text_type_main-large ${styles.title}`}>Детали ингредиента</h1>
			<IngredientDetails/>
		</div>
	);
};

export default IngredientDetailsPage;