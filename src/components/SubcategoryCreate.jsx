import React from 'react';
import { Create, SimpleForm, TextInput, LongTextInput, ImageField, ImageInput, ReferenceInput, SelectInput } from 'react-admin';

const SubcategoryTitle = ({ record }) => {

	return (<span>Sub-Department: Create New</span>);

};

const SubcategoryCreate = props => (
	<Create title={<SubcategoryTitle />} {...props}>
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
	</Create>
);

export default SubcategoryCreate;
