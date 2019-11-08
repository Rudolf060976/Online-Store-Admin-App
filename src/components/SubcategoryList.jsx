import React from 'react';
import { List, Datagrid, TextField, ReferenceField } from 'react-admin';

const SubcategoryList = props => (
	<List title="Sub-Departments" {...props}>
		<Datagrid rowClick="edit">
			<TextField source="id" />
			<TextField source="code" />
			<TextField source="name" />         
			<ReferenceField label="Category" source="category" reference="categories" sortBy="category.name" linkType="show">
				<TextField source="name" />
			</ReferenceField>
		</Datagrid>
	</List>
);

export default SubcategoryList;
