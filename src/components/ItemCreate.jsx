import React from 'react';
import {
	Create,
	SimpleForm,
	TextInput,
	LongTextInput,
	ImageField,
	ImageInput,
	ReferenceInput,
	SelectInput,
	NumberInput,
	ArrayInput,
	SimpleFormIterator,
	BooleanInput
} from 'react-admin';

const ItemTitle = ({ record }) => {

	return (<span>Items: Create New</span>);

};

const targetChoices = [

	{ name: 'All' },
	{ name: 'Men' },
	{ name: 'Women' },
	{ name: 'Girls' },
	{ name: 'Boys' },
	{ name: 'Children' },
	{ name: 'Babies' }

];

const conditionChoices = [

	{ name: 'New' },
	{ name: 'Used' }

];

const ItemCreate = props => (
	<Create title={<ItemTitle />} {...props}>
		<SimpleForm>
			<TextInput disabled source="code" />
			<TextInput source="name" />		
			<ReferenceInput label="Sub-Department" source="subcategory" reference="subdepartments" sort={{ field: 'name', order: 'ASC'}}>
				<SelectInput optionText="name" />
			</ReferenceInput>						
			<TextInput source="shortDescription" />	
			<LongTextInput source="longDescription" />
			<NumberInput source="price" defaultValue={0} />
			<ArrayInput source="keyFeatures">
				<SimpleFormIterator>
					<TextInput source="title" label="Feature Title" />
					<LongTextInput source="description" label="Feature Description" />
				</SimpleFormIterator>
			</ArrayInput>
			<SelectInput source="target" choices={targetChoices} optionText="name" optionValue="name" defaultValue="All" />
			<SelectInput source="condition" choices={conditionChoices} optionText="name" optionValue="name" defaultValue="New" />
			<TextInput source="model" />
			<BooleanInput source="inStock" label="Available In Stock?" options={{ checked: true }} />
			<NumberInput source="stock" defaultValue={0} />
			<BooleanInput source="isActive" label="Is Active?" options={{ checked: true }} />			
			<ImageInput label="Images" source="pictures" accept="image/*" multiple>
				<ImageField source="url" />				
			</ImageInput>
		</SimpleForm>
	</Create>
);

export default ItemCreate;
