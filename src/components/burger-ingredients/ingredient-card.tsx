import { useDrag } from 'react-dnd';
import { CurrencyIcon, Counter } from '@ya.praktikum/react-developer-burger-ui-components';
import { ItemTypes } from '../../utils/dnd-types';
import styles from './burger-ingredients.module.css';
import { IngredientCardProps } from '../../utils/types';

const IngredientCard = ({ item, count, onClick }: IngredientCardProps) => {
	const [{ isDragging }, drag] = useDrag({
		type: ItemTypes.INGREDIENT,
		item: { id: item._id },
		collect: (monitor) => ({
			isDragging: monitor.isDragging()
		})
	});

	const opacity = isDragging ? 0.5 : 1;

	return (
		<div
			ref={drag}
			style={{ opacity }}
			onClick={() => onClick(item)}
			className={styles.ingredientCard}
			data-testid={`ingredient-${item._id}`}
		>
			{count > 0 && <Counter count={count} size="default" />}
			<img src={item.image} alt={item.name} className={styles.ingredientImage} />
			<div className={`${styles.price} mt-1 mb-1`}>
				<span className="text text_type_digits-default mr-2">{item.price}</span>
				<CurrencyIcon type="primary" />
			</div>
			<p className={`text text_type_main-default ${styles.ingredientName}`}>
				{item.name}
			</p>
		</div>
	);
};

export default IngredientCard;