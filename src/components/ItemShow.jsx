import React from 'react';
import {
	Show,
	SimpleShowLayout,
	TextField,
	ImageField,
	SingleFieldList,
	ReferenceField,
	NumberField,
	ArrayField,
	Datagrid,
	BooleanField,
	ReferenceArrayField
} from 'react-admin';

const ItemTitle = ({ record }) => {

	return (<span>Item: { record ? `${record.name}` : '' }</span>);

};

const ItemShow = props => (
	<Show title={<ItemTitle />} {...props}>
		<SimpleShowLayout>
			<TextField source="code" />
			<TextField source="name" />		
			<ReferenceField label="Sub-Department" source="subcategory" reference="subdepartments" sort={{ field: 'name', order: 'ASC' }}>
				<TextField source="name" />
			</ReferenceField>						
			<TextField source="shortDescription" />	
			<TextField source="longDescription" />
			<NumberField source="price" defaultValue={0} />
			<ArrayField source="keyFeatures">
				<Datagrid>
					<TextField source="title" label="Feature Title" />
					<TextField source="description" label="Feature Description" />
				</Datagrid>
			</ArrayField>
			<TextField source="target" />
			<TextField source="condition" />
			<TextField source="model" />
			<BooleanField source="inStock" label="Available In Stock?" options={{ checked: true }} />
			<NumberField source="stock" defaultValue={0} />
			<BooleanField source="isActive" label="Is Active?" />
			<ReferenceArrayField label="Images" reference="images" source="images">
				<SingleFieldList>
					<ImageField source="url" />
				</SingleFieldList>
			</ReferenceArrayField>
		</SimpleShowLayout>
	</Show>
);

export default ItemShow;
