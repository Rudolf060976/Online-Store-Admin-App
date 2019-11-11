import React from 'react';
import { List, Datagrid, TextField, ReferenceField } from 'react-admin';

const SubcategoryList = props => (
	<List title="Sub-Departments" {...props}>
		<Datagrid rowClick="show">
			<TextField source="code" />
			<TextField source="name" />         
			<ReferenceField label="Category" source="category" reference="departments" sortBy="category.name" linkType="show">
				<TextField source="name" />
			</ReferenceField>
		</Datagrid>
	</List>
);

export default SubcategoryList;
