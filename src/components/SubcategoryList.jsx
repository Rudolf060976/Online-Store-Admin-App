import React from 'react';
import { Filter, List, Datagrid, TextField, ReferenceField, ReferenceInput, SelectInput } from 'react-admin';

const SubFilter = props => (
	<Filter {...props}>
		<ReferenceInput label="Filter by" source="category" reference="departments" sort={{ field: 'name', order: 'ASC' }} alwaysOn>
			<SelectInput optionText="name" />
		</ReferenceInput>
	</Filter>
);


const SubcategoryList = props => (
	<List title="Sub-Departments" filters={<SubFilter />} {...props}>
		<Datagrid rowClick="show">
			<TextField source="code" />
			<TextField source="name" />         
			<ReferenceField label="Department" source="category" reference="departments" sortBy="category.name" linkType="show">
				<TextField source="name" />
			</ReferenceField>
		</Datagrid>
	</List>
);

export default SubcategoryList;
