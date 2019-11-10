import React from 'react';
import { Edit, SimpleForm, LongTextInput, TextInput, ImageField, ImageInput } from 'react-admin';

const CategoryTitle = ({ record }) => {

	return (<span>Category: { record ? `${record.name} - Edit Mode` : '' }</span>);

};

const CategoryEdit = props => (
	<Edit title={<CategoryTitle />} {...props}>
		<SimpleForm>
			<TextInput source="code" />
			<TextInput source="name" />
			<LongTextInput source="description" />
			<ImageInput source="pictures" label="Images" accept="image/*" multiple>
				<ImageField source="url" />
			</ImageInput>
		</SimpleForm>
	</Edit>
);

export default CategoryEdit;
