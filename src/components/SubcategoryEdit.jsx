import React from 'react';
import { Edit, SimpleForm, TextInput, LongTextInput, ImageField, ImageInput, ReferenceInput, SelectInput } from 'react-admin';

const SubcategoryTitle = ({ record }) => {

	return (<span>Subdepartment: { record ? `${record.name} - Edit Mode` : '' }</span>);

};

const SubcategoryEdit = props => (
	<Edit title={<SubcategoryTitle />} {...props}>
		<SimpleForm>
			<TextInput source="code" />
			<TextInput source="name" />			
			<ReferenceInput label="Department" source="category" reference="departments">
				<SelectInput optionText="name" />
			</ReferenceInput>
			<LongTextInput source="description" />
			<ImageInput label="Images" source="pictures" accept="image/*" multiple>
				<ImageField source="url" />				
			</ImageInput>
		</SimpleForm>
	</Edit>
);

export default SubcategoryEdit;
