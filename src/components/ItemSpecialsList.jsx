import React from 'react';
import { List, Datagrid, ReferenceArrayField, SingleFieldList, ChipField } from 'react-admin';


const ItemSpecialsList = props => (
	<List title="Item Specials" {...props}>
		<Datagrid rowClick="show">
			<ReferenceArrayField label="Deals of The Day" reference="items" source="dealOfTheDayItems">
				<SingleFieldList>
					<ChipField source="name" />
				</SingleFieldList>
			</ReferenceArrayField>
			<ReferenceArrayField label="Best Sellers" reference="items" source="bestSellerItems">
				<SingleFieldList>
					<ChipField source="name" />
				</SingleFieldList>
			</ReferenceArrayField>
			<ReferenceArrayField label="Season Deals" reference="items" source="seasonDealItems">
				<SingleFieldList>
					<ChipField source="name" />
				</SingleFieldList>
			</ReferenceArrayField>
			<ReferenceArrayField label="Must Have" reference="items" source="mustHaveItems">
				<SingleFieldList>
					<ChipField source="name" />
				</SingleFieldList>
			</ReferenceArrayField>
			<ReferenceArrayField label="Free Shippings" reference="items" source="freeShippingItems">
				<SingleFieldList>
					<ChipField source="name" />
				</SingleFieldList>
			</ReferenceArrayField>			
		</Datagrid>
	</List>
);

export default ItemSpecialsList;
