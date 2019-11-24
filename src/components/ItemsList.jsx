import React from 'react';
import { Filter, List, Datagrid, TextField, ReferenceField, ReferenceInput, SelectInput, NumberField } from 'react-admin';

const ItemFilter = props => (
	<Filter {...props}>
		<ReferenceInput label="Filter by Dep" source="category" reference="departments" sort={{ field: 'name', order: 'ASC' }} alwaysOn>
			<SelectInput optionText="name" />
		</ReferenceInput>
		<ReferenceInput label="Filter by Sub-Dep" source="subcategory" reference="subdepartments" sort={{ field: 'name', order: 'ASC' }} alwaysOn>
			<SelectInput optionText="name" />
		</ReferenceInput>
	</Filter>
);


const ItemsList = props => (
	<List title="Items" filters={<ItemFilter />} {...props}>
		<Datagrid rowClick="show">
			<TextField source="code" />
			<TextField source="name" />         
			<ReferenceField label="Department" source="category" reference="departments" sortBy="category.name" linkType="show">
				<TextField source="name" />
			</ReferenceField>
			<ReferenceField label="Sub-Department" source="subcategory" reference="subdepartments" sortBy="subcategory.name" linkType="show">
				<TextField source="name" />
			</ReferenceField>
			<NumberField source="price" options={{ style: 'currency', currency: 'USD' }} />
		</Datagrid>
	</List>
);

export default ItemsList;
