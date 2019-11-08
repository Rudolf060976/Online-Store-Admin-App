import React from 'react';
import { Edit, SimpleForm, DisabledInput, LongTextInput, TextInput, ImageField, ImageInput, ReferenceArrayField, SingleFieldList } from 'react-admin';

const CategoryTitle = ({ record }) => {

	return (<span>Category: { record ? `${record.name}` : '' }</span>);

};

const CategoryEdit = props => (
	<Edit title={<CategoryTitle />} {...props}>
		<SimpleForm>
			<DisabledInput source="id" />			
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
