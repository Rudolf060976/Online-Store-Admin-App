import React from 'react';
import { Edit, SimpleForm, TextInput, ImageField, ImageInput, ReferenceInput, SelectInput } from 'react-admin';

const SubcategoryTitle = ({ record }) => {

	return (<span>Editing Sub-Department: { record ? `${record.name}` : '' }</span>);

};

const SubcategoryEdit = props => (
	<Edit title={<SubcategoryTitle />} {...props}>
		<SimpleForm>
			<TextInput disabled source="code" />
			<TextInput source="name" />			
			<ReferenceInput label="Department" source="category" reference="departments">
				<SelectInput optionText="name" />
			</ReferenceInput>
			<TextInput source="description" multiline />
			<ImageInput label="Images" source="pictures" accept="image/*" multiple>
				<ImageField source="url" />				
			</ImageInput>
		</SimpleForm>
	</Edit>
);

export default SubcategoryEdit;
