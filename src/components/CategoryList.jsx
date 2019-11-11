import React from 'react';
import { List, Datagrid, TextField, ReferenceManyField, SingleFieldList, ChipField } from 'react-admin';

const CategoryList = props => (
	<List title="Departments" {...props}>
		<Datagrid rowClick="show">
			<TextField source="code" />
			<TextField source="name" />
			<ReferenceManyField label="SubDepartments" reference="subdepartments" target="category" sort={{ field: 'name', order: 'ASC' }}>
				<SingleFieldList>
					<ChipField source="name" />
				</SingleFieldList>
			</ReferenceManyField>
		</Datagrid>
	</List>
);

export default CategoryList;
