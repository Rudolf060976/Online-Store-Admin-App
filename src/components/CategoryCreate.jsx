import React from 'react';
import { Create, SimpleForm, LongTextInput, TextInput, ImageInput, ImageField } from 'react-admin';


const CategoryTitle = ({ record }) => {

	return (<span>Department: Create New</span>);

};

const CategoryCreate = props => (
	<Create title={<CategoryTitle />} {...props}>
		<SimpleForm>
			<TextInput source="code" />
			<TextInput source="name" />
			<LongTextInput source="description" />	
			<ImageInput source="pictures" label="Images" accept="image/*" multiple>
				<ImageField source="url" />
			</ImageInput>		
		</SimpleForm>
	</Create>
);

export default CategoryCreate;
