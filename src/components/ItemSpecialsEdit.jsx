import React from 'react';
import { Edit, SimpleForm, ReferenceArrayInput, AutocompleteArrayInput, SelectArrayInput } from 'react-admin';


const ItemSpecialsEdit = props => (
	<Edit title="Editing Item Specials" {...props}>
		<SimpleForm>
			<ReferenceArrayInput label="Deals of the Day" reference="items" source="dealOfTheDayItems">
				<SelectArrayInput />
			</ReferenceArrayInput>
			<ReferenceArrayInput label="Best Sellers" reference="items" source="bestSellerItems">
				<SelectArrayInput />
			</ReferenceArrayInput>
			<ReferenceArrayInput label="Season Deals" reference="items" source="seasonDealItems">
				<SelectArrayInput />
			</ReferenceArrayInput>
			<ReferenceArrayInput label="Must Have" reference="items" source="mustHaveItems">
				<SelectArrayInput />
			</ReferenceArrayInput>
			<ReferenceArrayInput label="Free Shipping" reference="items" source="freeShippingItems">
				<SelectArrayInput />
			</ReferenceArrayInput>
		</SimpleForm>
	</Edit>
);

export default ItemSpecialsEdit;
