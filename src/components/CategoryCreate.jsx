import React from 'react';
import { Create, SimpleForm, LongTextInput, TextInput } from 'react-admin';

const CategoryCreate = props => (
	<Create {...props}>
		<SimpleForm>
			<TextInput source="code" />
			<TextInput source="name" />
			<LongTextInput source="description" />			
		</SimpleForm>
	</Create>
);

export default CategoryCreate;
