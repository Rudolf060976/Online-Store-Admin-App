import React from 'react';
import { Edit, SimpleForm, TextInput, ImageField, ImageInput } from 'react-admin';

const CategoryTitle = ({ record }) => {

	return (<span>Editing Department: { record ? `${record.name}` : '' }</span>);

};

const CategoryEdit = props => (
	<Edit title={<CategoryTitle />} {...props}>
		<SimpleForm>
			<TextInput disabled source="code" />
			<TextInput source="name" />
			<TextInput source="description" multiline />
			<ImageInput source="pictures" label="Images" accept="image/*" multiple>
				<ImageField source="url" />
			</ImageInput>
		</SimpleForm>
	</Edit>
);

export default CategoryEdit;
