import React from 'react';
import { Edit, SimpleForm, ReferenceArrayInput, AutocompleteArrayInput } from 'react-admin';


const ItemSpecialsEdit = props => (
	<Edit title="Editing Item Specials" {...props}>
		<SimpleForm>
			<ReferenceArrayInput label="Deals of the Day" reference="items" source="dealOfTheDayItems">
				<AutocompleteArrayInput />
			</ReferenceArrayInput>
			<ReferenceArrayInput label="Best Sellers" reference="items" source="bestSellerItems">
				<AutocompleteArrayInput />
			</ReferenceArrayInput>
			<ReferenceArrayInput label="Season Deals" reference="items" source="seasonDealItems">
				<AutocompleteArrayInput />
			</ReferenceArrayInput>
			<ReferenceArrayInput label="Must Have" reference="items" source="mustHaveItems">
				<AutocompleteArrayInput />
			</ReferenceArrayInput>
			<ReferenceArrayInput label="Free Shipping" reference="items" source="freeShippingItems">
				<AutocompleteArrayInput />
			</ReferenceArrayInput>
		</SimpleForm>
	</Edit>
);

export default ItemSpecialsEdit;
