import React from 'react';
import { Show, SimpleShowLayout, TextField, ReferenceField, ReferenceArrayField, SingleFieldList, ImageField } from 'react-admin';

const SubcategoryTitle = ({ record }) => {

	return (<span>Subdepartment: { record ? `${record.name}` : '' }</span>);

};

const SubcategoryShow = props => (
	<Show title={<SubcategoryTitle />} {...props}>
		<SimpleShowLayout>
			<TextField source="code" />
			<TextField source="name" />
			<TextField source="description" />
			<ReferenceField label="Department" source="category" reference="departments" linkType="show">
				<TextField source="name" />
			</ReferenceField>
			<ReferenceArrayField label="Images" reference="images" source="images">
				<SingleFieldList>
					<ImageField source="url" />
				</SingleFieldList>
			</ReferenceArrayField>
		</SimpleShowLayout>
	</Show>
);

export default SubcategoryShow;
